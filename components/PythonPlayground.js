'use client';

import { useEffect, useRef, useState } from 'react';

const DEFAULT_CODE = 'cookies = [1, 3, 2]\\ncookies.sort()\\nprint(cookies)';
const PYTHON_COMPLETIONS = [
  'and','as','assert','async','await','break','class','continue','def','del','elif','else','except','False','finally','for','from','global','if','import','in','is','lambda','None','nonlocal','not','or','pass','raise','return','True','try','while','with','yield',
  'abs','all','any','bool','dict','enumerate','filter','float','int','isinstance','len','list','map','max','min','print','range','reversed','round','set','sorted','str','sum','tuple','type','zip',
  'append','clear','copy','count','extend','get','index','items','keys','pop','remove','reverse','sort','values'
];

// Keep one worker for the lifetime of the browser tab so route changes do not
// repeatedly initialize Pyodide. The worker is created only when Run is pressed.
let sharedWorker = null;
const workerSubscribers = new Set();
let sharedExecutionTimeout = null;

function getSharedWorker() {
  if (!sharedWorker) {
    sharedWorker = new Worker('/python-worker.js');
    sharedWorker.onmessage = (event) => {
      workerSubscribers.forEach((subscriber) => subscriber(event));
    };
    sharedWorker.onerror = () => {
      const errorEvent = { data: { type: 'fatal', error: 'Python 실행 환경을 불러오지 못했습니다. 네트워크 연결 또는 브라우저의 CDN 접근을 확인해 주세요.' } };
      workerSubscribers.forEach((subscriber) => subscriber(errorEvent));
      if (sharedExecutionTimeout) clearTimeout(sharedExecutionTimeout);
      sharedExecutionTimeout = null;
      sharedWorker?.terminate();
      sharedWorker = null;
    };
  }
  return sharedWorker;
}

function terminateSharedWorker() {
  if (sharedExecutionTimeout) clearTimeout(sharedExecutionTimeout);
  sharedExecutionTimeout = null;
  sharedWorker?.terminate();
  sharedWorker = null;
}

export default function PythonPlayground({ title = 'Python 실험실', initialOpen = false }) {
  const [open, setOpen] = useState(initialOpen);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle');
  const [hasRun, setHasRun] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const editorRef = useRef(null);
  const keyRef = useRef('python-playground:global');

  useEffect(() => {
    keyRef.current = `python-playground:${title || 'global'}`;
    try {
      const saved = window.localStorage.getItem(keyRef.current);
      if (saved !== null) setCode(saved);
    } catch {}
  }, [title]);

  useEffect(() => {
    const subscriber = (event) => {
      const data = event.data || {};
      if (data.type === 'loading-runtime') {
        setStatus('loading');
        setOutput('Python 실행 환경을 처음 불러오는 중입니다. 첫 실행은 조금 더 걸릴 수 있어요.');
      } else if (data.type === 'ready') {
        setStatus('running');
      } else if (data.type === 'started') {
        setStatus('running');
        if (sharedExecutionTimeout) clearTimeout(sharedExecutionTimeout);
        sharedExecutionTimeout = setTimeout(() => {
          terminateSharedWorker();
          const timeoutEvent = { data: { type: 'fatal', error: '실행 시간이 너무 길어 실행을 중단했어요. 무한 반복문이 있는지 확인해 주세요.' } };
          workerSubscribers.forEach((listener) => listener(timeoutEvent));
        }, 5000);
      } else if (data.type === 'result') {
        if (sharedExecutionTimeout) clearTimeout(sharedExecutionTimeout);
        sharedExecutionTimeout = null;
        const combined = [data.output, data.error].filter(Boolean).join(data.output && data.error ? '\n' : '');
        setOutput(combined || '(출력 결과가 없습니다. print()를 사용해 결과를 확인해 보세요.)');
        setStatus(data.error ? 'error' : 'done');
      } else if (data.type === 'fatal') {
        if (sharedExecutionTimeout) clearTimeout(sharedExecutionTimeout);
        sharedExecutionTimeout = null;
        setOutput(data.error || 'Python 실행 중 오류가 발생했습니다.');
        setStatus('error');
      }
    };
    workerSubscribers.add(subscriber);
    return () => {
      workerSubscribers.delete(subscriber);
    };
  }, []);

  function updateSuggestions(nextCode, cursor) {
    const beforeCursor = nextCode.slice(0, cursor);
    const match = beforeCursor.match(/[A-Za-z_][A-Za-z0-9_]*$/);
    if (!match || match[0].length < 1) {
      setSuggestions([]);
      return;
    }
    const token = match[0];
    const matches = PYTHON_COMPLETIONS.filter((item) => item.startsWith(token) && item !== token).slice(0, 8);
    setSuggestions(matches);
    setSuggestionIndex(0);
  }

  function applySuggestion(value) {
    const editor = editorRef.current;
    if (!editor) return;
    const cursor = editor.selectionStart;
    const before = code.slice(0, cursor);
    const after = code.slice(editor.selectionEnd);
    const match = before.match(/[A-Za-z_][A-Za-z0-9_]*$/);
    const prefix = match ? before.slice(0, match.index) : before;
    const nextCode = prefix + value + after;
    saveCode(nextCode);
    setSuggestions([]);
    requestAnimationFrame(() => {
      editor.focus();
      const nextCursor = prefix.length + value.length;
      editor.setSelectionRange(nextCursor, nextCursor);
    });
  }

  function handleEditorKeyDown(event) {
    const editor = event.currentTarget;
    if (suggestions.length && event.key === 'ArrowDown') {
      event.preventDefault();
      setSuggestionIndex((index) => (index + 1) % suggestions.length);
      return;
    }
    if (suggestions.length && event.key === 'ArrowUp') {
      event.preventDefault();
      setSuggestionIndex((index) => (index - 1 + suggestions.length) % suggestions.length);
      return;
    }
    if (suggestions.length && (event.key === 'Tab' || event.key === 'Enter') && !event.shiftKey) {
      event.preventDefault();
      applySuggestion(suggestions[suggestionIndex]);
      return;
    }
    if (event.key === 'Escape') {
      setSuggestions([]);
      return;
    }
    if (event.ctrlKey && event.code === 'Space') {
      event.preventDefault();
      updateSuggestions(code, editor.selectionStart);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      if (event.shiftKey) {
        const lineStart = code.lastIndexOf('\\n', Math.max(0, start - 1)) + 1;
        const lineEndRaw = code.indexOf('\\n', end);
        const lineEnd = lineEndRaw === -1 ? code.length : lineEndRaw;
        const block = code.slice(lineStart, lineEnd);
        const nextBlock = block.replace(/^( {1,4}|\\t)/gm, '');
        const nextCode = code.slice(0, lineStart) + nextBlock + code.slice(lineEnd);
        saveCode(nextCode);
        requestAnimationFrame(() => {
          editor.focus();
          editor.setSelectionRange(Math.max(lineStart, start - 4), Math.max(lineStart, end - (block.length - nextBlock.length)));
        });
      } else {
        const nextCode = code.slice(0, start) + '    ' + code.slice(end);
        saveCode(nextCode);
        setSuggestions([]);
        requestAnimationFrame(() => {
          editor.focus();
          editor.setSelectionRange(start + 4, start + 4);
        });
      }
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const lineStart = code.lastIndexOf('\\n', start - 1) + 1;
      const currentLine = code.slice(lineStart, start);
      const indent = currentLine.match(/^\\s*/)?.[0] || '';
      const extraIndent = /:\\s*$/.test(currentLine) ? '    ' : '';
      const insertion = '\\n' + indent + extraIndent;
      const nextCode = code.slice(0, start) + insertion + code.slice(end);
      saveCode(nextCode);
      setSuggestions([]);
      requestAnimationFrame(() => {
        editor.focus();
        const nextCursor = start + insertion.length;
        editor.setSelectionRange(nextCursor, nextCursor);
      });
    }
  }

  function saveCode(nextCode) {
    setCode(nextCode);
    try { window.localStorage.setItem(keyRef.current, nextCode); } catch {}
  }

  function runCode() {
    if (status === 'loading' || status === 'running') return;
    setHasRun(true);
    setOutput('실행 준비 중...');
    setStatus('loading');
    getSharedWorker().postMessage({ type: 'run', code });
  }

  function resetCode() {
    if (status === 'loading' || status === 'running') return;
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
            <div className="python-editor-shell">
              <textarea
                ref={editorRef}
                id="python-playground-editor"
                className="python-playground-editor"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                value={code}
                onChange={(event) => {
                  saveCode(event.target.value);
                  updateSuggestions(event.target.value, event.target.selectionStart);
                }}
                onKeyDown={handleEditorKeyDown}
                onKeyUp={(event) => {
                  if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) updateSuggestions(code, event.currentTarget.selectionStart);
                }}
                aria-label="Python 코드 입력"
                aria-describedby="python-editor-help"
              />
              {suggestions.length > 0 && (
                <div className="python-completion-list" role="listbox" aria-label="Python 자동완성">
                  {suggestions.map((item, index) => (
                    <button key={item} type="button" role="option" aria-selected={index === suggestionIndex}
                      className={index === suggestionIndex ? 'is-active' : ''}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => applySuggestion(item)}>
                      <code>{item}</code><span>{PYTHON_COMPLETIONS.indexOf(item) < 34 ? 'keyword' : 'Python'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p id="python-editor-help" className="python-editor-help">Tab 들여쓰기 · Shift+Tab 내어쓰기 · Enter 자동 들여쓰기 · Ctrl+Space 자동완성</p>
            <div className="python-playground-actions">
              <button type="button" className="button-primary" onClick={runCode} disabled={status === 'loading' || status === 'running'}>
                {status === 'loading' || status === 'running' ? '실행 중…' : '▶ 실행'}
              </button>
              <button type="button" className="button-secondary" onClick={resetCode} disabled={status === 'loading' || status === 'running'}>초기화</button>
              <button type="button" className="button-secondary" onClick={copyCode}>코드 복사</button>
              <span className="python-status" aria-live="polite">{status === 'loading' ? '환경 준비 중' : status === 'running' ? '실행 중' : status === 'done' ? '완료' : status === 'error' ? '오류' : status === 'copied' ? '복사됨' : '대기 중'}</span>
            </div>
            <div className="python-output-wrap">
              <div className="python-output-title"><strong>실행 결과</strong>{hasRun && <button type="button" onClick={() => { setOutput(''); setHasRun(false); setStatus('idle'); }}>지우기</button>}</div>
              <pre className={`python-playground-output ${status === 'error' ? 'is-error' : ''}`} aria-live="polite">{output || '실행 결과가 여기에 표시됩니다.'}</pre>
            </div>
            <p className="python-playground-note">페이지를 열 때 Python 런타임을 불러오지 않습니다. 첫 실행 때만 다운로드하며, 같은 탭에서 페이지를 이동해도 실행 환경을 재사용합니다. 오래 실행되는 코드는 자동으로 중단됩니다.</p>
          </section>
        </div>
      )}
    </>
  );
}
