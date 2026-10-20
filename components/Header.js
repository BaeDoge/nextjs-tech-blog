import Link from 'next/link';
import SearchBox from './SearchBox';
export default function Header({ posts }) { return <header className="site-header"><div className="header-inner"><Link href="/" className="brand"><span className="brand-mark">&lt;/&gt;</span><span>Dev Notes<small>실전 개발 기록</small></span></Link><nav aria-label="주 메뉴"><Link href="/category/algorithm">알고리즘</Link><Link href="/category/troubleshooting">트러블슈팅</Link><Link href="/about">소개</Link></nav><SearchBox posts={posts} compact /></div></header>; }
