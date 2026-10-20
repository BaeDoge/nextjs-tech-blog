"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
export default function SearchBox({ posts, compact = false }) {
  const [query, setQuery] = useState('');
  const searchablePosts = posts.map(({ category, slug, title, summary, tag, categoryLabel, publishedAt }) => ({ category, slug, title, summary, tag, categoryLabel, publishedAt }));
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return [];
    return searchablePosts.filter((p) => `${p.title} ${p.summary} ${p.tag} ${p.categoryLabel}`.toLocaleLowerCase().includes(q)).slice(0, 6);
  }, [query, posts]);
  return <div className={`search-wrap ${compact ? 'search-compact' : ''}`}><label className="sr-only" htmlFor="site-search">글 검색</label><div className="search-input-wrap"><span aria-hidden="true">⌕</span><input id="site-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="오류 메시지, 알고리즘, Python 검색" autoComplete="off" /></div>{query.trim() && <div className="search-results">{results.length ? results.map((p) => <Link key={`${p.category}/${p.slug}`} href={`/${p.category}/${p.slug}`} onClick={() => setQuery('')}><strong>{p.title}</strong><small>{p.categoryLabel} · {p.publishedAt}</small></Link>) : <p>검색 결과가 없습니다. 다른 키워드로 검색해 보세요.</p>}</div>}</div>;
}
