import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HtmlLanguage from '@/components/HtmlLanguage';
import { getAllPosts, getSiteUrl } from '@/lib/posts';

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: 'baejoon | 개발과 기술을 함께 공부하는 기록', template: '%s | baejoon' },
  description: '알고리즘, 트러블슈팅, 논문과 오픈소스 분석을 기록하는 개발 블로그입니다.',
  applicationName: 'baejoon',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'baejoon',
    title: 'baejoon',
    description: '개발 과정에서 배운 기술과 연구를 쉽게 풀어 기록합니다.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  const toSearchEntry = ({ content, ...post }) => post;
  const posts = getAllPosts('ko').map(toSearchEntry);
  const englishPosts = getAllPosts('en').map(toSearchEntry);
  return (
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <HtmlLanguage />
        <Header posts={posts} englishPosts={englishPosts} />
        <main className="main-shell">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
