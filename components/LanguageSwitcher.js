"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
  const target = isEnglish
    ? ((pathname === '/en' ? '' : pathname.slice(3)) || '/')
    : (pathname === '/' ? '/en' : `/en${pathname}`);

  return (
    <Link
      href={target}
      className="language-switch"
      hrefLang={isEnglish ? 'ko' : 'en'}
      aria-label={isEnglish ? '한국어로 보기' : 'View this site in English'}
      title={isEnglish ? '한국어' : 'English'}
    >
      {isEnglish ? '한국어' : 'EN'}
    </Link>
  );
}
