import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import AdSlot from '@/components/AdSlot';
import PythonPlayground from '@/components/PythonPlayground';
import { getAllPosts, getPost, getRelatedPosts, CATEGORIES, getSiteUrl } from '@/lib/posts';

const mdxOptions = { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]] } };

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ category: post.category, slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) return {};
  const canonical = `/${category}/${slug}`;
  const imageUrl = post.coverImage || `/${category}/${slug}/opengraph-image`;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical },
    openGraph: {
      type: 'article', locale: 'ko_KR', siteName: 'baejoon',
      title: post.title, description: post.summary, url: canonical,
      publishedTime: post.publishedAt, modifiedTime: post.updatedAt,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.summary, images: [imageUrl] },
  };
}

function ArticleJsonLd({ post }) {
  const url = `${getSiteUrl()}/${post.category}/${post.slug}`;
  const data = {
    '@context': 'https://schema.org', '@type': 'TechArticle',
    headline: post.title, description: post.summary,
    datePublished: post.publishedAt, dateModified: post.updatedAt,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'baejoon' },
    publisher: { '@type': 'Organization', name: 'baejoon' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export default async function ArticlePage({ params }) {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) notFound();
  const related = getRelatedPosts(post);

  return (
    <>
      <ArticleJsonLd post={post} />
      <div className="article-breadcrumb">
        <Link href="/">홈</Link><span>/</span>
        <Link href={`/category/${category}`}>{CATEGORIES[category].label}</Link><span>/</span>
        <span>{post.title}</span>
      </div>
      <header className="article-header">
        <span className="post-category">{post.categoryLabel}</span>
        <h1>{post.title}</h1>
        <p className="article-summary">{post.summary}</p>
        <div className="article-byline">
          <span className="author-avatar">함</span>
          <span><b>baejoon</b><small>주니어 개발자 성장일기</small></span>
          <span className="byline-spacer" />
          <time dateTime={post.publishedAt}>{post.publishedAt}</time><span>·</span><span>{post.readingMinutes}분 읽기</span>
        </div>
      </header>
      <AdSlot className="ad-article-top" />
      <div className="article-layout">
        <article className="prose">
          <MDXRemote source={post.content} options={mdxOptions} />
          <div className="article-end"><span>END OF NOTE</span><p>이 글을 읽으며 궁금한 코드를 직접 실행해 보세요.</p><small>작은 실험이 이해를 도와줄 수 있어요.</small></div>
        </article>
        <aside className="article-sidebar">
          <PythonPlayground title={post.title} />
          <div className="sidebar-card"><span className="eyebrow">IN THIS ARTICLE</span><p>본문의 제목을 활용해 필요한 부분을 빠르게 찾아보세요.</p><a href="#top">맨 위로 ↑</a></div>
          <AdSlot className="ad-sidebar" />
        </aside>
      </div>
      <AdSlot className="ad-article-bottom" />
      <section className="related-section">
        <div className="section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>함께 읽으면 좋은 글</h2></div><Link href={`/category/${category}`}>카테고리 더 보기 ↗</Link></div>
        <div className="related-grid">{related.map((item) => <Link className="related-card" href={`/${item.category}/${item.slug}`} key={`${item.category}/${item.slug}`}><span className="post-category">{item.categoryLabel}</span><h3>{item.title}</h3><p>{item.summary}</p><span className="related-date">{item.publishedAt} · {item.readingMinutes}분 읽기</span></Link>)}</div>
      </section>
    </>
  );
}
