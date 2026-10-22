import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllPosts, getSiteUrl } from '@/lib/posts';

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: 'baejoon | 알고리즘과 개발 기록', template: '%s | baejoon' },
  description: '알고리즘 문제와 개발하면서 부딪친 에러를 정리했어요. 함께 공부하고 성장하는 주니어 개발자 기술 블로그입니다.',
  applicationName: 'baejoon',
  openGraph: { type: 'website', locale: 'ko_KR', siteName: 'baejoon', title: 'baejoon', description: '알고리즘 문제와 개발하면서 부딪친 에러를 정리했어요.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  const posts = getAllPosts();
  return <html lang="ko" data-scroll-behavior="smooth"><body><Header posts={posts} /><main className="main-shell">{children}</main><Footer /></body></html>;
}
