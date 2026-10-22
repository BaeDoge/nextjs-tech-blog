import Link from 'next/link';
import SearchBox from './SearchBox';

export default function Header({ posts }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="baejoon 홈">
          <span className="brand-mark">&lt;/&gt;</span>
          <span>baejoon<small>주니어 개발자 성장일기</small></span>
        </Link>
        <nav aria-label="주 메뉴">
          <Link href="/category/algorithm">알고리즘</Link>
          <Link href="/category/troubleshooting">트러블슈팅</Link>
          <Link href="/lab">실습실</Link>
          <Link href="/about">소개</Link>
        </nav>
        <SearchBox posts={posts} compact />
      </div>
    </header>
  );
}
