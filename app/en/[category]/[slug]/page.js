import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import AdSlot from '@/components/AdSlot';
import PythonPlayground from '@/components/PythonPlayground';
import ArticlePre from '@/components/ArticlePre';
import { Callout, Badge, StatGrid, Stat, Steps, Step, Compare, ComparePanel, Terminal, FileTree, Figure, Timeline, TimelineItem, Checklist, Kbd } from '@/components/ArticleBlocks';
import { getAllPosts, getPost, getRelatedPosts, EN_CATEGORIES, getSiteUrl } from '@/lib/posts';

const mdxOptions = { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]] } };
const mdxComponents = { pre: ArticlePre, Callout, Badge, StatGrid, Stat, Steps, Step, Compare, ComparePanel, Terminal, FileTree, Figure, Timeline, TimelineItem, Checklist, Kbd };

export function generateStaticParams() {
  return getAllPosts('en').map((post) => ({ category: post.category, slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const post = getPost(category, slug, 'en');
  if (!post) {
    const koreanPost = getPost(category, slug, 'ko');
    return {
      title: koreanPost ? `English translation coming soon: ${koreanPost.title}` : 'Article not found',
      robots: { index: false, follow: true },
      alternates: koreanPost ? { canonical: `/${category}/${slug}` } : undefined,
    };
  }
  const canonical = `/en/${category}/${slug}`;
  const imageUrl = post.coverImage || canonical + '/opengraph-image';
  return {
    title: post.title, description: post.summary,
    alternates: { canonical, languages: { ko: `/${category}/${slug}`, en: canonical } },
    openGraph: { type: 'article', locale: 'en_US', siteName: 'baejoon', title: post.title, description: post.summary, url: canonical, publishedTime: post.publishedAt, modifiedTime: post.updatedAt, images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.summary, images: [imageUrl] },
  };
}

function ArticleJsonLd({ post }) {
  const url = `${getSiteUrl()}/en/${post.category}/${post.slug}`;
  const data = { '@context': 'https://schema.org', '@type': 'TechArticle', headline: post.title, description: post.summary, datePublished: post.publishedAt, dateModified: post.updatedAt, inLanguage: 'en', mainEntityOfPage: url, author: { '@type': 'Organization', name: 'baejoon' }, publisher: { '@type': 'Organization', name: 'baejoon' } };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export default async function EnglishArticlePage({ params }) {
  const { category, slug } = await params;
  if (!EN_CATEGORIES[category]) notFound();
  const post = getPost(category, slug, 'en');
  if (!post) {
    const koreanPost = getPost(category, slug, 'ko');
    if (!koreanPost) notFound();
    return <section className="translation-empty translation-missing">
      <span className="eyebrow">ENGLISH TRANSLATION</span><h1>English edition coming soon</h1>
      <p>The English version of <strong>{koreanPost.title}</strong> is being prepared. We review technical details and code examples before publishing translations.</p>
      <Link className="button-secondary" href={`/${category}/${slug}`}>Read the Korean original ↗</Link>
      <p className="translation-back"><Link href="/en">Explore available English articles</Link></p>
    </section>;
  }

  const related = getRelatedPosts(post, 3, 'en');
  const hasCodePlayground = ['algorithm', 'troubleshooting'].includes(post.category);
  return <>
    <ArticleJsonLd post={post} />
    <div className="article-breadcrumb"><Link href="/en">Home</Link><span>/</span><Link href={`/en/category/${category}`}>{EN_CATEGORIES[category].label}</Link><span>/</span><span>{post.title}</span></div>
    <header className="article-header">
      <span className="post-category">{post.categoryLabel}</span><h1>{post.title}</h1><p className="article-summary">{post.summary}</p>
      <div className="article-byline"><span className="author-avatar">b</span><span><b>baejoon</b><small>Engineering notes and learning journal</small></span><span className="byline-spacer" /><time dateTime={post.publishedAt}>{post.publishedAt}</time><span>·</span><span>{post.readingMinutes} min read</span></div>
    </header>
    <AdSlot className="ad-article-top" />
    <div className={`article-layout ${hasCodePlayground ? '' : 'article-layout--single'}`}>
      <article className="prose">
        <MDXRemote source={post.content} options={mdxOptions} components={mdxComponents} />
        {hasCodePlayground && <div className="article-end"><span>END OF NOTE</span><p>Try running the examples and experimenting with the code.</p><small>Small experiments can make difficult concepts easier to understand.</small></div>}
      </article>
      {hasCodePlayground && <aside className="article-sidebar"><PythonPlayground title={post.title} locale="en" /><div className="sidebar-card"><span className="eyebrow">IN THIS ARTICLE</span><p>Use the article headings to find the section you need.</p><a href="#top">Back to top ↑</a></div><AdSlot className="ad-sidebar" /></aside>}
    </div>
    <AdSlot className="ad-article-bottom" />
    <section className="related-section">
      <div className="section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>Related articles</h2></div><Link href={`/en/category/${category}`}>More in this topic ↗</Link></div>
      <div className="related-grid">{related.map((item) => <Link className="related-card" href={`/en/${item.category}/${item.slug}`} key={`${item.category}/${item.slug}`}><span className="post-category">{item.categoryLabel}</span><h3>{item.title}</h3><p>{item.summary}</p><span className="related-date">{item.publishedAt} · {item.readingMinutes} min read</span></Link>)}</div>
    </section>
  </>;
}
