import PythonPlayground from '@/components/PythonPlayground';
export const metadata = { title: 'Python Playground', description: 'Write and run Python snippets directly in your browser.', alternates: { canonical: '/en/lab', languages: { ko: '/lab', en: '/en/lab' } } };
export default function EnglishLabPage() {
  return <section className="lab-page"><div className="lab-hero"><span className="eyebrow">BROWSER PYTHON PLAYGROUND</span>
    <h1>Turn an idea<br /><span>into a quick experiment.</span></h1>
    <p>Write a small snippet, explore an example, and inspect the result without setting up a local Python environment.</p>
    <div className="lab-playground-start"><PythonPlayground title="Python Playground" initialOpen /></div></div>
    <div className="lab-note-card"><h2>Ideas to try</h2><ul><li>Explore how sorting, loops, and data structures work</li><li>Change input values and compare function results</li><li>Test a short algorithm with edge cases</li></ul>
      <p>Execution happens in your browser, so the site does not need to run a separate Python server. The runtime is downloaded on the first run and reused on the same page.</p></div></section>;
}
