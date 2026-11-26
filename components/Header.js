"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBox from './SearchBox';
import LanguageSwitcher from './LanguageSwitcher';
import { getCategoryPath } from '@/lib/posts';

export default function Header({ posts, englishPosts }) {
  const pathname = usePathname() || '/';
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
  const locale = isEnglish ? 'en' : 'ko';
  const labels = isEnglish
    ? { tagline: 'Notes on learning and building', algorithm: 'Algorithms', troubleshooting: 'Troubleshooting', paper: 'Papers', opensource: 'Open source', lab: 'Playground', about: 'About' }
    : { tagline: '주니어 개발자 성장일기', algorithm: '알고리즘', troubleshooting: '트러블슈팅', paper: '논문', opensource: '오픈소스 분석', lab: '실습실', about: '소개' };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href={isEnglish ? '/en' : '/'} className="brand" aria-label={isEnglish ? 'baejoon home' : 'baejoon 홈'}>
          <span className="brand-mark">&lt;/&gt;</span>
          <span>baejoon<small>{labels.tagline}</small></span>
        </Link>
        <nav aria-label={isEnglish ? 'Main navigation' : '주 메뉴'}>
          <Link href={getCategoryPath('algorithm', locale)}>{labels.algorithm}</Link>
          <Link href={getCategoryPath('troubleshooting', locale)}>{labels.troubleshooting}</Link>
          <Link href={getCategoryPath('paper', locale)}>{labels.paper}</Link>
          <Link href={getCategoryPath('opensource', locale)}>{labels.opensource}</Link>
          <Link href={isEnglish ? '/en/lab' : '/lab'}>{labels.lab}</Link>
          <Link href={isEnglish ? '/en/about' : '/about'}>{labels.about}</Link>
        </nav>
        <SearchBox posts={posts} englishPosts={englishPosts} compact />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
