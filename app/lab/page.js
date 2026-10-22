import Link from 'next/link';

const EXERCISES = [
  {
    title: '쿠키 할당 최대화',
    slug: 'assign-cookies',
    notebook: 'algorithm/assign-cookies.ipynb',
    tags: ['그리디', '정렬', '투 포인터'],
    summary: '아이들에게 줄 수 있는 쿠키를 선택해 만족하는 아이의 수를 최대화합니다.',
    difficulty: '기초',
  },
];

function getNotebookUrl(baseUrl, notebook) {
  if (!baseUrl || !notebook) return null;
  const base = baseUrl.replace(/\/+$/, '');
  return `${base}/lab/index.html?path=${encodeURIComponent(notebook)}`;
}

export const metadata = {
  title: '알고리즘 실습실',
  description: '브라우저에서 Python으로 알고리즘 문제를 직접 풀어보세요.',
};

export default async function LabPage({ searchParams }) {
  const params = await searchParams;
  const requestedNotebook = typeof params?.notebook === 'string' ? params.notebook : '';
  const safeNotebook = /^[a-zA-Z0-9_/-]+\.ipynb$/.test(requestedNotebook)
    && !requestedNotebook.split('/').includes('..')
    ? requestedNotebook
    : '';
  const baseUrl = process.env.NEXT_PUBLIC_JUPYTERLITE_URL || '';
  const notebookUrl = getNotebookUrl(baseUrl, safeNotebook);

  if (safeNotebook && notebookUrl) {
    return (
      <section className="lab-page">
        <div className="lab-topbar">
          <div>
            <span className="eyebrow">PRACTICE LAB / PYTHON</span>
            <h1>직접 풀고, 실행하고, 이해하기.</h1>
            <p>코드를 수정하고 셀을 실행해 보세요. 중요한 풀이 결과는 노트북 파일로 다운로드해 보관할 수 있습니다.</p>
          </div>
          <Link className="button-secondary" href="/lab">실습 목록으로 돌아가기</Link>
        </div>
        <div className="lab-frame-wrap">
          <iframe
            className="lab-frame"
            src={notebookUrl}
            title="JupyterLite Python 알고리즘 실습"
            loading="eager"
            allow="clipboard-read; clipboard-write"
          />
        </div>
        <p className="lab-note">코드는 이 브라우저에서 실행됩니다. 저장은 같은 실습 사이트와 브라우저에 한정되므로, 계속 보관할 작업은 .ipynb 파일로 다운로드하세요.</p>
      </section>
    );
  }

  return (
    <section className="lab-page">
      <div className="lab-hero">
        <span className="eyebrow">PRACTICE LAB</span>
        <h1>직접 풀고, 실행하고,<br /><span>이해하기.</span></h1>
        <p>브라우저에서 Python 코드를 작성하고 실행하며 알고리즘을 연습하세요. 설치나 계정 없이 시작하는 실습 공간을 준비하고 있습니다.</p>
      </div>

      {!baseUrl && (
        <div className="lab-setup-notice">
          <strong>실습 환경 연결이 아직 필요합니다.</strong>
          <p>JupyterLite를 별도 Vercel 프로젝트로 배포한 뒤 블로그 프로젝트에 NEXT_PUBLIC_JUPYTERLITE_URL 환경 변수를 설정하면 이곳에서 바로 실행할 수 있습니다.</p>
          <a href="https://github.com/BaeDoge/nextjs-tech-blog/tree/feature/jupyterlite-lab/jupyterlite" target="_blank" rel="noreferrer">배포 안내와 노트북 파일 보기 ↗</a>
        </div>
      )}

      <div className="section-heading lab-section-heading">
        <div>
          <span className="eyebrow">ALGORITHM EXERCISES</span>
          <h2>실습할 문제</h2>
        </div>
        <p>각 문제를 열어 코드를 직접 구현하고 테스트해 보세요.</p>
      </div>

      <div className="lab-exercise-list">
        {EXERCISES.map((exercise) => {
          const href = `/lab?notebook=${encodeURIComponent(exercise.notebook)}`;
          return (
            <article className="lab-exercise-card" key={exercise.slug}>
              <div className="lab-exercise-meta">
                <span>{exercise.difficulty}</span>
                {exercise.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <h2>{exercise.title}</h2>
              <p>{exercise.summary}</p>
              <div className="lab-exercise-actions">
                <Link className="button-secondary" href={href}>실습 시작 ↗</Link>
                <span>Python · JupyterLite</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
