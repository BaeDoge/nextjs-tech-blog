"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SearchBox({ posts = [], englishPosts, compact = false }) {
  const [query, setQuery] = useState('');
  const pathname = usePathname() || '/';
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
  const localePosts = isEnglish ? (englishPosts || posts) : posts;
  const searchablePosts = useMemo(
    () => localePosts.map(({ category, slug, title, summary, tag, categoryLabel, publishedAt }) => ({
      category, slug, title, summary, tag, categoryLabel, publishedAt,
    })),
    [localePosts]
  );
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return [];
    return searchablePosts
      .filter((post) => `${post.title} ${post.summary} ${post.tag} ${post.categoryLabel}`.toLocaleLowerCase().includes(q))
      .slice(0, 6);
  }, [query, searchablePosts]);

  const labels = isEnglish
    ? { label: 'Search articles', placeholder: 'Search errors, algorithms, Python...', empty: 'No matching articles. Try another keyword.' }
    : { label: '글 검색', placeholder: '오류 메시지, 알고리즘, Python 검색', empty: '검색 결과가 없습니다. 다른 키워드로 검색해 보세요.' };
  const base = isEnglish ? '/en' : '';

  return (
    <div className={`search-wrap ${compact ? 'search-compact' : ''}`}>
      <label className="sr-only" htmlFor={compact ? 'site-search-header' : 'site-search-home'}>{labels.label}</label>
      <div className="search-input-wrap">
        <span aria-hidden="true">⌕</span>
        <input
          id={compact ? 'site-search-header' : 'site-search-home'}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.placeholder}
          autoComplete="off"
          aria-expanded={Boolean(query.trim())}
          aria-controls={compact ? 'search-results-header' : 'search-results-home'}
        />
      </div>
      {query.trim() && (
        <div id={compact ? 'search-results-header' : 'search-results-home'} className="search-results" role="listbox">
          {results.length ? results.map((post) => (
            <Link
              key={`${post.category}/${post.slug}`}
              href={`${base}/${post.category}/${post.slug}`}
              onClick={() => setQuery('')}
              role="option"
            >
              <strong>{post.title}</strong>
              <small>{post.categoryLabel} · {post.publishedAt}</small>
            </Link>
          )) : <p>{labels.empty}</p>}
        </div>
      )}
    </div>
  );
}
