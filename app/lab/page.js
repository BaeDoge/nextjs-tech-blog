import PythonPlayground from '@/components/PythonPlayground';

export const metadata = {
  title: 'Python 실험실',
  description: '브라우저에서 Python 코드를 작성하고 즉시 실행해 보세요.',
};

export default function LabPage() {
  return (
    <section className="lab-page">
      <div className="lab-hero">
        <span className="eyebrow">BROWSER PYTHON PLAYGROUND</span>
        <h1>떠오른 아이디어를<br /><span>바로 실행해 보기.</span></h1>
        <p>문제를 읽다가 궁금해진 코드를 자유롭게 작성하고 결과를 확인하세요. 문제별 노트북이나 계정은 필요하지 않습니다.</p>
        <div className="lab-playground-start"><PythonPlayground title="Python 실험실" initialOpen /></div>
      </div>
      <div className="lab-note-card">
        <h2>이렇게 활용해 보세요</h2>
        <ul>
          <li>정렬이나 반복문이 실제로 어떻게 동작하는지 확인하기</li>
          <li>입력값을 바꾸면서 함수의 결과 비교하기</li>
          <li>짧은 알고리즘을 작성하고 예외 상황 테스트하기</li>
        </ul>
        <p>실행은 브라우저에서 처리되므로 별도의 Python 서버를 운영하지 않습니다. 처음 실행할 때만 런타임을 내려받으며, 이후에는 같은 페이지에서 재사용합니다.</p>
      </div>
    </section>
  );
}
