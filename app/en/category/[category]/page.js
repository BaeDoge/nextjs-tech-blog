import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, EN_CATEGORIES } from '@/lib/posts';
import AdSlot from '@/components/AdSlot';

export function generateStaticParams() {
  return Object.keys(EN_CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const item = EN_CATEGORIES[category];
  if (!item) return {};
  return {
    title: item.label,
    description: item.description,
    alternates: { canonical: `/en/category/${category}`, languages: { ko: `/category/${category}`, en: `/en/category/${category}` } },
    openGraph: { locale: 'en_US', title: item.label, description: item.description },
  };
}

export default async function EnglishCategoryPage({ params }) {
  const { category } = await params;
  const item = EN_CATEGORIES[category];
  if (!item) notFound();
  const posts = getAllPosts('en').filter((post) => post.category === category);
  return <>
    <section className="page-heading"><span className="eyebrow">CATEGORY / {category.toUpperCase()}</span><h1>{item.label}</h1><p>{item.description}</p><span className="result-count">{posts.length} translated {posts.length === 1 ? 'article' : 'articles'}</span></section>
    <AdSlot />
    <div className="archive-list">{posts.map((post) => <Link href={`/en/${post.category}/${post.slug}`} className="archive-card" key={post.slug}>
      <div className="archive-meta"><span className="post-category">{post.tag}</span><span>{post.publishedAt} · {post.readingMinutes} min read</span></div>
      <h2>{post.title}</h2><p>{post.summary}</p><span className="archive-link">Read article ↗</span>
    </Link>)}</div>
    {!posts.length && <div className="translation-empty"><h3>No English articles in this category yet.</h3><p>Translations are being prepared. You can read the original Korean articles in the meantime.</p><Link className="button-secondary" href={`/category/${category}`}>Browse Korean {item.label.toLowerCase()} ↗</Link></div>}
  </>;
}
