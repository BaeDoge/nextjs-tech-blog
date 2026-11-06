import React from 'react';

const VARIANTS = new Set(['info', 'tip', 'warning', 'success', 'important']);

export function Callout({ type = 'info', title, children }) {
  const variant = VARIANTS.has(type) ? type : 'info';
  return <aside className={`mdx-callout mdx-callout--${variant}`} role="note">
    {title && <strong className="mdx-callout-title">{title}</strong>}
    <div className="mdx-callout-body">{children}</div>
  </aside>;
}

export function Badge({ children, tone = 'neutral' }) {
  const allowed = new Set(['neutral', 'green', 'blue', 'amber', 'red']);
  const color = allowed.has(tone) ? tone : 'neutral';
  return <span className={`mdx-badge mdx-badge--${color}`}>{children}</span>;
}

export function StatGrid({ children }) {
  return <div className="mdx-stat-grid">{children}</div>;
}

export function Stat({ value, label, detail }) {
  return <div className="mdx-stat"><strong>{value}</strong><span>{label}</span>{detail && <small>{detail}</small>}</div>;
}

export function Steps({ children }) {
  return <ol className="mdx-steps">{children}</ol>;
}

export function Step({ title, children }) {
  return <li className="mdx-step"><div className="mdx-step-content">{title && <strong>{title}</strong>}<div>{children}</div></div></li>;
}

export function Compare({ children }) {
  return <div className="mdx-compare">{children}</div>;
}

export function ComparePanel({ title, tone = 'neutral', children }) {
  const color = ['good', 'bad', 'neutral'].includes(tone) ? tone : 'neutral';
  return <section className={`mdx-compare-panel mdx-compare-panel--${color}`}>{title && <h4>{title}</h4>}<div>{children}</div></section>;
}

export function Terminal({ title = 'Terminal', children }) {
  return <section className="mdx-terminal"><div className="mdx-terminal-bar"><span/><span/><span/><b>{title}</b></div><div className="mdx-terminal-content">{children}</div></section>;
}

export function FileTree({ title = 'Project structure', children }) {
  return <section className="mdx-file-tree"><div className="mdx-file-tree-title">{title}</div><div className="mdx-file-tree-content">{children}</div></section>;
}

export function Figure({ src, alt = '', caption, width = '100%' }) {
  if (!src) return null;
  return <figure className="mdx-figure"><img src={src} alt={alt} style={{ width }} loading="lazy"/>{caption && <figcaption>{caption}</figcaption>}</figure>;
}

export function Timeline({ children }) {
  return <ol className="mdx-timeline">{children}</ol>;
}

export function TimelineItem({ date, title, children }) {
  return <li className="mdx-timeline-item">{date && <time>{date}</time>}{title && <strong>{title}</strong>}<div>{children}</div></li>;
}

export function Checklist({ children }) {
  return <div className="mdx-checklist">{children}</div>;
}

export function Kbd({ children }) {
  return <kbd className="mdx-kbd">{children}</kbd>;
}
