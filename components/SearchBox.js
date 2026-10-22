"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function SearchBox({ posts, compact = false }) {
  const [query, setQuery] = useState('');
  const searchablePosts = useMemo(() => posts.map(({ category, slug, title, summary, tag, categoryLabel, publishedAt }) => ({ category, slug, title, summary, tag, categoryLabel, publishedAt })), [posts]);
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return [];
    return searchablePosts.filter((p) => `${p.title} ${p.summary} ${p.tag} ${p.categoryLabel}`.toLocaleLowerCase().includes(q)).slice(0, 6);
  }, [query, searchablePosts]);

  return (
    <div className={`search-wrap ${compact ? 'search-compact' : ''}`}>
      <label className="sr-only" htmlFor={compact ? 'site-search-header' : 'site-search-home'}>글 검색</label>
      <div className="search-input-wrap">
        <span aria-hidden="true">⌕</span>
        <input id={compact ? 'site-search-header' : 'site-search-home'} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="오류 메시지, 알고리즘, Python 검색" autoComplete="off" aria-expanded={Boolean(query.trim())} aria-controls={compact ? 'search-results-header' : 'search-results-home'} />
      </div>
      {query.trim() && (
        <div id={compact ? 'search-results-header' : 'search-results-home'} className="search-results" role="listbox">
          {results.length ? results.map((p) => (
            <Link key={`${p.category}/${p.slug}`} href={`/${p.category}/${p.slug}`} onClick={() => setQuery('')} role="option">
              <strong>{p.title}</strong><small>{p.categoryLabel} · {p.publishedAt}</small>
            </Link>
          )) : <p>검색 결과가 없습니다. 다른 키워드로 검색해 보세요.</p>}
        </div>
      )}
    </div>
  );
}
