import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { getAllPosts } from '@/lib/posts';

const mdxOptions = { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } };

function getDailyPost(posts) {
  const algorithms = posts.filter((post) => post.category === 'algorithm');
  if (!algorithms.length) return null;
  const dayNumber = Math.floor(Date.now() / 86400000);
  return algorithms[((dayNumber % algorithms.length) + algorithms.length) % algorithms.length];
}

function extractProblem(content) {
  const match = content.match(/(?:^|\n)##\s*(?:문제(?:\s*설명)?|Problem(?:\s*Statement)?)\s*\n([\s\S]*?)(?=\n##\s|$)/i);
  if (match?.[1]?.trim()) return match[1].trim();
  return content.split(/\n##\s/)[1]?.split(/\n##\s/)[0]?.trim() || '';
}

export default function TodayAlgorithm() {
  const post = getDailyPost(getAllPosts());
  if (!post) return <section className="today-algorithm"><p>알고리즘 글을 준비하고 있어요. 곧 오늘의 문제를 소개할게요!</p></section>;

  const problemBody = extractProblem(post.content);
  const leetcodeMatch = post.content.match(/https?:\/\/leetcode\.com\/problems\/[^\s)]+/i);
  const problemUrl = leetcodeMatch ? leetcodeMatch[0].replace(/[.,]+$/, '') : `https://leetcode.com/problemset/`;

  return (
    <section className="today-algorithm" aria-labelledby="today-algorithm-title">
      <div className="today-algorithm-top"><div><span className="eyebrow">DAILY CHALLENGE</span><h2 id="today-algorithm-title">오늘의 알고리즘</h2><p>오늘의 문제를 읽고, 한 번 직접 풀어보세요.</p></div><span className="today-badge">TODAY'S PICK</span></div>
      <article className="today-problem-card">
        <div className="today-problem-meta"><span>알고리즘</span><span>{post.publishedAt}</span></div>
        <h3>{post.title}</h3>
        <div className="today-problem-body prose">{problemBody ? <MDXRemote source={problemBody} options={mdxOptions} /> : <p>{post.summary}</p>}</div>
        <div className="today-problem-footer"><span>먼저 생각해 보고, 풀이를 확인해 보세요.</span><div className="today-actions"><Link className="button-secondary" href={`/algorithm/${post.slug}`}>해설 보기</Link><a className="button-primary" href={problemUrl} target="_blank" rel="noreferrer">LeetCode에서 풀어보기 ↗</a></div></div>
      </article>
      <p className="today-disclaimer">문제는 블로그에 게시된 알고리즘 글 중에서 날짜에 따라 선정됩니다. 온라인 IDE와 자동 채점은 제공하지 않으며, LeetCode에서 문제를 풀 수 있어요.</p>
    </section>
  );
}
