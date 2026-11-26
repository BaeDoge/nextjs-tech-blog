export const metadata = { title: 'About', description: 'Learn about baejoon, a technical blog covering problem solving and software engineering.', alternates: { canonical: '/en/about', languages: { ko: '/about', en: '/en/about' } } };
export default function EnglishAboutPage() {
  return <section className="legal-page"><span className="eyebrow">ABOUT THIS BLOG</span><h1>Notes for solving and understanding engineering problems</h1>
    <p className="legal-lead">baejoon is a technical learning journal that turns algorithm practice, software troubleshooting, research, and open-source exploration into practical notes.</p>
    <h2>What you will find</h2><ul><li>Algorithms and data structures explained through coding problems</li><li>Root-cause analysis of Python and web development issues</li><li>Research paper summaries connected to practical engineering</li><li>Source-code walkthroughs of real open-source projects</li></ul>
    <h2>Editorial principles</h2><p>Examples should be clear and reproducible whenever possible. External sources are credited, and technical claims and code samples should be reviewed before publication. Automated drafts are treated as drafts, not as authoritative answers.</p>
    <p>Articles are provided for learning and reference. Results may differ depending on software versions and execution environments.</p></section>;
}
