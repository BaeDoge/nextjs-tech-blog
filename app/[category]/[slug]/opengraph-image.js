
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getPost, CATEGORIES } from '@/lib/posts';

export const runtime = 'nodejs';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export const alt = 'Dev Notes 기술 블로그 글 대표 이미지';

export default async function Image({ params }) {
  const { category, slug } = await params;
  const post = getPost(category, slug);

  const title = post?.title || 'Dev Notes';
  const categoryLabel =
    post?.categoryLabel || CATEGORIES[category]?.label || 'DEV NOTES';
  const summary = post?.summary || '';

  // 한국어 글자가 정상적으로 출력되도록 폰트를 프로젝트에 포함합니다.
  const fontDir = path.join(process.cwd(), 'public', 'fonts');

  const [regularFont, boldFont] = await Promise.all([
    readFile(path.join(fontDir, 'NotoSansKR-Regular.ttf')),
    readFile(path.join(fontDir, 'NotoSansKR-Bold.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: '#111827',
          color: '#F9FAFB',
          fontFamily: 'Noto Sans KR',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 20,
            color: '#67E8F9',
          }}
        >
          <span>DEV NOTES</span>
          <span>{categoryLabel}</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div
            style={{
              color: '#67E8F9',
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            TECHNICAL NOTES
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.3,
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 23,
              color: '#CBD5E1',
              lineHeight: 1.5,
              overflow: 'hidden',
            }}
          >
            {summary}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#94A3B8',
            fontSize: 17,
          }}
        >
          <span>ERROR → ROOT CAUSE → SOLUTION</span>
          <span>ALGORITHM · TROUBLESHOOTING</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Noto Sans KR',
          data: regularFont,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Noto Sans KR',
          data: boldFont,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
