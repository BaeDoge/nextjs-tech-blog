import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div><Link href="/" className="footer-brand">baejoon</Link><p>알고리즘 문제와 개발하면서 부딪친 에러를 정리했어요.</p></div>
        <nav aria-label="푸터"><Link href="/about">사이트 소개</Link><Link href="/contact">문의</Link><Link href="/privacy">개인정보 처리방침</Link></nav>
        <small>© {new Date().getFullYear()} baejoon. All rights reserved.</small>
      </div>
    </footer>
  );
}
