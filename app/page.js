import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import AdSlot from '@/components/AdSlot';
import TodayAlgorithm from '@/components/TodayAlgorithm';
import Guestbook from '@/components/Guestbook';
import { getAllPosts, CATEGORIES } from '@/lib/posts';

// Refresh the date-based algorithm pick periodically without making every request dynamic.
export const revalidate = 300;

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts[0];

  return <>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="status-dot"/> 함께 배우고 성장하는 개발 기록</div>
        <h1>함께<br/><span>공부합시다.</span></h1>
        <p>알고리즘 문제와 개발하면서 부딪친 에러를 정리했어요.</p>
        <div className="hero-search"><SearchBox posts={posts} /></div>
        <div className="hero-stats"><span><b>{posts.length.toString().padStart(2, '0')}</b>개의 글</span><span><b>02</b>개 카테고리</span><span>함께 공부하는 중</span></div>
      </div>
      <div className="hero-visual" aria-hidden="true"><div className="code-window"><div className="window-top"><i/><i/><i/><span>study.py</span></div><pre><span className="code-purple">def</span> <span className="code-blue">learn</span>(problem):<br/>    <span className="code-muted"># 한 단계씩 이해하기</span><br/>    idea = <span className="code-yellow">think</span>(problem)<br/>    answer = <span className="code-green">practice</span>(idea)<br/><br/>    <span className="code-purple">return</span> answer<br/><br/><span className="code-muted"># learn · share · grow</span></pre><div className="code-status"><span/> LEARNING TOGETHER</div></div><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/></div>
    </section>
    <AdSlot className="ad-home" />
    <section className="section-block">
      <div className="section-heading"><div><span className="eyebrow">EXPLORE TOPICS</span><h2>무엇을 공부할까요?</h2></div><p>지금 필요한 주제를 골라보세요.</p></div>
      <div className="category-grid">{Object.entries(CATEGORIES).map(([key, value], i) => <Link className="category-card" href={`/category/${key}`} key={key}><span className="category-icon">{i === 0 ? '↗' : '⌘'}</span><span className="category-count">{posts.filter(p => p.category === key).length} POSTS</span><h3>{value.label}</h3><p>{value.description}</p><span className="card-arrow">글 둘러보기 ↗</span></Link>)}</div>
    </section>
    <section className="section-block latest-section">
      <div className="section-heading"><div><span className="eyebrow">LATEST NOTES</span><h2>최근 발행한 글</h2></div><span className="muted">새로운 기록을 꾸준히 업데이트합니다.</span></div>
      {featured && <Link href={`/${featured.category}/${featured.slug}`} className="featured-post"><div className="featured-label">LATEST ARTICLE <span>↗</span></div><div className="featured-content"><span className="post-category">{featured.categoryLabel}</span><h3>{featured.title}</h3><p>{featured.summary}</p><div className="post-meta">{featured.publishedAt} <span>·</span> {featured.readingMinutes}분 읽기</div></div><div className="featured-decoration" aria-hidden="true">{featured.category === 'algorithm' ? '01' : '⌘'}</div></Link>}
      <div className="post-list">{posts.slice(featured ? 1 : 0, 7).map(post => <Link href={`/${post.category}/${post.slug}`} className="post-row" key={`${post.category}/${post.slug}`}><span className="post-row-category">{post.categoryLabel}</span><span className="post-row-main"><strong>{post.title}</strong><small>{post.summary}</small></span><span className="post-row-date">{post.publishedAt}</span><span className="row-arrow">↗</span></Link>)}</div>
      <div className="center-action"><Link href="/category/algorithm" className="button-secondary">모든 글 살펴보기 ↗</Link></div>
    </section>
    <section className="community-section"><TodayAlgorithm /></section>
    <Guestbook />
  </>;
}
