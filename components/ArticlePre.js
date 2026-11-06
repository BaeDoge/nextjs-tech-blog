import FlowDiagram from './FlowDiagram';

export default function ArticlePre({ children, ...props }) {
  const code = Array.isArray(children) ? children[0] : children;
  const className = code?.props?.className || '';

  if (className.split(/\\s+/).includes('language-flow')) {
    const raw = code?.props?.children ?? '';
    const nodes = String(raw)
      .split(/\\r?\\n/)
      .map((line) => line.replace(/^\\s*(?:→|->|⟶)\\s*/, '').trim())
      .filter(Boolean);

    if (nodes.length >= 2) return <FlowDiagram nodes={nodes} />;
  }

  return <pre {...props}>{children}</pre>;
}
