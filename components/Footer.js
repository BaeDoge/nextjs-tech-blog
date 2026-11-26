"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname() || '/';
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Link href={isEnglish ? '/en' : '/'} className="footer-brand">baejoon</Link>
          <p>{isEnglish
            ? 'Notes on algorithms, troubleshooting, research papers, and open-source projects.'
            : '알고리즘, 트러블슈팅, 논문과 오픈소스 분석을 기록합니다.'}</p>
        </div>
        <nav aria-label={isEnglish ? 'Footer navigation' : '푸터'}>
          <Link href={isEnglish ? '/en/about' : '/about'}>{isEnglish ? 'About' : '사이트 소개'}</Link>
          <Link href={isEnglish ? '/en/contact' : '/contact'}>{isEnglish ? 'Contact' : '문의'}</Link>
          <Link href={isEnglish ? '/en/privacy' : '/privacy'}>{isEnglish ? 'Privacy policy' : '개인정보 처리방침'}</Link>
        </nav>
        <small>© {new Date().getFullYear()} baejoon. All rights reserved.</small>
      </div>
    </footer>
  );
}
