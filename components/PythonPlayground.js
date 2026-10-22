'use client';

import { useEffect, useRef, useState } from 'react';

const DEFAULT_CODE = 'cookies = [1, 3, 2]\ncookies.sort()\nprint(cookies)';

export default function PythonPlayground({ title = 'Python 실험실', initialOpen = false }) {
  const [open, setOpen] = useState(initialOpen);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle');
  const [hasRun, setHasRun] = useState(false);
  const workerRef = useRef(null);
  const timeoutRef = useRef(null);
  const keyRef = useRef('python-playground:global');

  useEffect(() => {
    keyRef.current = `python-playground:${title || 'global'}`;
    try {
      const saved = window.localStorage.getItem(keyRef.current);
      if (saved !== null) setCode(saved);
    } catch {}
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [title]);

  useEffect(() => {
    if (!open || !initialOpen) return;
    setOpen(true);
  }, [initialOpen, open]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  function saveCode(nextCode) {
    setCode(nextCode);
    try { window.localStorage.setItem(keyRef.current, nextCode); } catch {}
  }

  function getWorker() {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker('/python-worker.js');
    worker.onmessage = (event) => {
      const data = event.data || {};
      if (data.type === 'loading-runtime') {
        setStatus('loading');
        setOutput('Python 실행 환경을 처음 불러오는 중입니다. 첫 실행은 조금 더 걸릴 수 있어요.');
      } else if (data.type === 'ready') {
        setStatus('running');
      } else if (data.type === 'started') {
        setStatus('running');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          worker.terminate();
          workerRef.current = null;
          setStatus('error');
          setOutput('실행 시간이 너무 길어 실행을 중단했어요. 무한 반복문이 있는지 확인해 주세요.');
        }, 5000);
      } else if (data.type === 'result') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        const combined = [data.output, data.error].filter(Boolean).join(data.output && data.error ? '\n' : '');
        setOutput(combined || '(출력 결과가 없습니다. print()를 사용해 결과를 확인해 보세요.)');
        setStatus(data.error ? 'error' : 'done');
      } else if (data.type === 'fatal') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setOutput(data.error || 'Python 실행 중 오류가 발생했습니다.');
        setStatus('error');
      }
    };
    worker.onerror = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      worker.terminate();
      workerRef.current = null;
      setOutput('Python 실행 환경을 불러오지 못했습니다. 네트워크 연결 또는 브라우저의 CDN 접근을 확인해 주세요.');
      setStatus('error');
    };
    workerRef.current = worker;
    return worker;
  }

  function runCode() {
    if (status === 'loading' || status === 'running') return;
    setHasRun(true);
    setOutput('실행 준비 중...');
    setStatus('loading');
    getWorker().postMessage({ type: 'run', code });
  }

  function resetCode() {
    const next = DEFAULT_CODE;
    saveCode(next);
    setOutput('');
    setStatus('idle');
    setHasRun(false);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
      setTimeout(() => setStatus((current) => current === 'copied' ? 'idle' : current), 1500);
    } catch {
      setOutput('코드를 복사할 수 없어요. 편집기에서 직접 선택해 복사해 주세요.');
      setStatus('error');
    }
  }

  return (
    <>
      <button type="button" className="python-playground-trigger" onClick={() => setOpen(true)}>
        <span aria-hidden="true">⌘</span>
        <span><strong>코드 실험하기</strong><small>브라우저에서 Python 실행</small></span>
        <span className="python-trigger-arrow" aria-hidden="true">↗</span>
      </button>
      {open && (
        <div className="python-playground-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="python-playground-panel" role="dialog" aria-modal="true" aria-label="Python 코드 실험실">
            <header className="python-playground-head">
              <div><span className="eyebrow">BROWSER PYTHON</span><h2>코드 실험실</h2><p>{title} · 코드는 브라우저에서 실행됩니다.</p></div>
              <button type="button" className="python-icon-button" onClick={() => setOpen(false)} aria-label="실험실 닫기">×</button>
            </header>
            <label className="python-editor-label" htmlFor="python-playground-editor">Python 코드</label>
            <textarea
              id="python-playground-editor"
              className="python-playground-editor"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              value={code}
              onChange={(event) => saveCode(event.target.value)}
              aria-label="Python 코드 입력"
            />
            <div className="python-playground-actions">
              <button type="button" className="button-primary" onClick={runCode} disabled={status === 'loading' || status === 'running'}>
                {status === 'loading' || status === 'running' ? '실행 중…' : '▶ 실행'}
              </button>
              <button type="button" className="button-secondary" onClick={resetCode}>초기화</button>
              <button type="button" className="button-secondary" onClick={copyCode}>코드 복사</button>
              <span className="python-status" aria-live="polite">{status === 'loading' ? '환경 준비 중' : status === 'running' ? '실행 중' : status === 'done' ? '완료' : status === 'error' ? '오류' : status === 'copied' ? '복사됨' : '대기 중'}</span>
            </div>
            <div className="python-output-wrap">
              <div className="python-output-title"><strong>실행 결과</strong>{hasRun && <button type="button" onClick={() => { setOutput(''); setHasRun(false); setStatus('idle'); }}>지우기</button>}</div>
              <pre className={`python-playground-output ${status === 'error' ? 'is-error' : ''}`} aria-live="polite">{output || '실행 결과가 여기에 표시됩니다.'}</pre>
            </div>
            <p className="python-playground-note">처음 실행할 때만 Python 런타임을 다운로드합니다. 일반적인 알고리즘 연습용이며, 오래 실행되는 코드는 자동으로 중단됩니다.</p>
          </section>
        </div>
      )}
    </>
  );
}
