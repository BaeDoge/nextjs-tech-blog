import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, CATEGORIES } from '@/lib/posts';
import AdSlot from '@/components/AdSlot';
export function generateStaticParams(){ return Object.keys(CATEGORIES).map(category=>({category})); }
export async function generateMetadata({params}) { const {category}=await params; const item=CATEGORIES[category]; return item ? {title:item.label,description:item.description} : {}; }
export default async function CategoryPage({params}) { const {category}=await params; const item=CATEGORIES[category]; if(!item) notFound(); const posts=getAllPosts().filter(p=>p.category===category); return <><section className="page-heading"><span className="eyebrow">CATEGORY / {category.toUpperCase()}</span><h1>{item.label}</h1><p>{item.description}</p><span className="result-count">총 {posts.length}개의 글</span></section><AdSlot/><div className="archive-list">{posts.map(post=><Link href={`/${post.category}/${post.slug}`} className="archive-card" key={post.slug}><div className="archive-meta"><span className="post-category">{post.tag}</span><span>{post.publishedAt} · {post.readingMinutes}분 읽기</span></div><h2>{post.title}</h2><p>{post.summary}</p><span className="archive-link">글 읽기 ↗</span></Link>)}</div>{!posts.length&&<div className="empty-state">아직 등록된 글이 없습니다.</div>}</>; }
