import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import { getAllPosts, EN_CATEGORIES, getCategoryPath } from '@/lib/posts';

export const revalidate = 300;
export const metadata = {
  title: 'Learn, build, and share | baejoon',
  description: 'Practical notes on algorithms, troubleshooting, research papers, and open-source engineering.',
  alternates: { canonical: '/en', languages: { ko: '/', en: '/en' } },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'baejoon', title: 'Learn, build, and share | baejoon', description: 'Practical notes on software development and engineering.' },
};

export default function EnglishHomePage() {
  const posts = getAllPosts('en');
  const featured = posts[0];
  return <>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="status-dot" /> LEARN · BUILD · SHARE</div>
        <h1>Keep<br /><span>learning together.</span></h1>
        <p>Practical notes from solving coding problems, debugging software, reading research, and exploring open source.</p>
        <div className="hero-search"><SearchBox posts={posts} /></div>
        <div className="hero-stats">
          <span><b>{posts.length.toString().padStart(2, '0')}</b> translated articles</span>
          <span><b>{Object.keys(EN_CATEGORIES).length.toString().padStart(2, '0')}</b> topics</span>
          <span>Always learning</span>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="code-window">
          <div className="window-top"><i /><i /><i /><span>study.py</span></div>
          <pre><span className="code-purple">def</span> <span className="code-blue">learn</span>(problem):<br />    idea = <span className="code-yellow">understand</span>(problem)<br />    answer = <span className="code-green">practice</span>(idea)<br /><br />    <span className="code-purple">return</span> answer<br /><br /><span className="code-muted"># learn · share · grow</span></pre>
          <div className="code-status"><span /> LEARNING TOGETHER</div>
        </div>
        <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
      </div>
    </section>
    <section className="section-block" id="topics">
      <div className="section-heading"><div><span className="eyebrow">EXPLORE TOPICS</span><h2>What would you like to learn?</h2></div><p>Choose a topic and explore the notes.</p></div>
      <div className="category-grid">
        {Object.entries(EN_CATEGORIES).map(([key, value]) => <Link className="category-card" href={getCategoryPath(key, 'en')} key={key}>
          <span className="category-icon">{({ algorithm: '↗', troubleshooting: '⌘', paper: '◉', opensource: '⌘' })[key]}</span>
          <span className="category-count">{posts.filter((post) => post.category === key).length} POSTS</span>
          <h3>{value.label}</h3><p>{value.description}</p><span className="card-arrow">Explore notes ↗</span>
        </Link>)}
      </div>
    </section>
    <section className="section-block latest-section">
      <div className="section-heading"><div><span className="eyebrow">LATEST NOTES</span><h2>Recently translated</h2></div><span className="muted">English editions are added as each article is reviewed.</span></div>
      {featured ? <>
        <Link href={`/en/${featured.category}/${featured.slug}`} className="featured-post">
          <div className="featured-label">LATEST ARTICLE <span>↗</span></div>
          <div className="featured-content"><span className="post-category">{featured.categoryLabel}</span><h3>{featured.title}</h3><p>{featured.summary}</p><div className="post-meta">{featured.publishedAt} <span>·</span> {featured.readingMinutes} min read</div></div>
          <div className="featured-decoration" aria-hidden="true">↗</div>
        </Link>
        <div className="post-list">{posts.slice(1, 7).map((post) => <Link href={`/en/${post.category}/${post.slug}`} className="post-row" key={`${post.category}/${post.slug}`}>
          <span className="post-row-category">{post.categoryLabel}</span><span className="post-row-main"><strong>{post.title}</strong><small>{post.summary}</small></span><span className="post-row-date">{post.publishedAt}</span><span className="row-arrow">↗</span>
        </Link>)}</div>
      </> : <div className="translation-empty">
        <span className="eyebrow">ENGLISH EDITION</span><h3>English translations are being prepared.</h3>
        <p>The Korean articles remain available while each English edition is translated and technically reviewed.</p>
        <Link className="button-secondary" href="/">Browse the Korean originals ↗</Link>
      </div>}
    </section>
  </>;
}
