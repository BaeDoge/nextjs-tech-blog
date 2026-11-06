export default function FlowDiagram({ nodes }) {
  return (
    <figure className="flow-diagram" aria-label={nodes.join(' 다음 단계: ')}>
      <figcaption>논문 설명을 바탕으로 재구성한 개념 흐름</figcaption>
      <ol>
        {nodes.map((node, index) => (
          <li key={`${index}-${node}`}>
            <span className="flow-step-number">{String(index + 1).padStart(2, '0')}</span>
            <strong>{node}</strong>
          </li>
        ))}
      </ol>
    </figure>
  );
}
