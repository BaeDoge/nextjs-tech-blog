import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllPosts, getSiteUrl } from '@/lib/posts';
export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: 'Dev Notes | 알고리즘과 개발 트러블슈팅', template: '%s | Dev Notes' },
  description: '코딩테스트 알고리즘 풀이와 Python, 웹 개발 오류의 원인 및 해결 방법을 기록하는 개발 블로그입니다.',
  applicationName: 'Dev Notes',
  openGraph: { type: 'website', locale: 'ko_KR', siteName: 'Dev Notes', title: 'Dev Notes', description: '알고리즘과 개발 트러블슈팅을 실전 예제로 정리합니다.' },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }) { const posts = getAllPosts(); return <html lang="ko" data-scroll-behavior="smooth"><body><Header posts={posts} /><main className="main-shell">{children}</main><Footer /></body></html>; }
