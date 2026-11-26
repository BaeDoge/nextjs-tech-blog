import { ImageResponse } from 'next/og';
import { getPost, EN_CATEGORIES } from '@/lib/posts';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'baejoon English technical article';

export default async function EnglishArticleImage({ params }) {
  const { category, slug } = await params;
  const post = getPost(category, slug, 'en');
  const title = post?.title || 'Engineering notes';
  const categoryLabel = post?.categoryLabel || EN_CATEGORIES[category]?.label || 'TECH NOTES';
  const summary = post?.summary || '';

  return new ImageResponse(
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px',
      background: '#172f2a',
      color: '#F9FAFB',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#b8f36b', fontSize: 22 }}>
        <span>BAEJOON · ENGLISH EDITION</span>
        <span>{categoryLabel.toUpperCase()}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ color: '#b8f36b', fontSize: 24, fontWeight: 700 }}>TECHNICAL NOTES</div>
        <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.25, overflow: 'hidden' }}>{title}</div>
        <div style={{ fontSize: 23, color: '#c3d0c8', lineHeight: 1.5, overflow: 'hidden' }}>{summary}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a9bbb0', fontSize: 18 }}>
        <span>LEARN · BUILD · SHARE</span><span>baejoon.vercel.app</span>
      </div>
    </div>,
    { ...size }
  );
}
