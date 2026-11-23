import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SITE_URL = 'https://baejoon.vercel.app';

export const CATEGORIES = {
  algorithm: { label: '알고리즘', description: '문제 풀이와 핵심 알고리즘을 단계별로 정리합니다.' },
  troubleshooting: { label: '트러블슈팅', description: '개발 중 마주친 오류의 원인과 해결 과정을 기록합니다.' },
  paper: { label: '논문', description: 'AI, 소프트웨어, 컴퓨터 시스템 등 개발과 연결되는 연구를 쉽게 풀어봅니다.' },
  opensource: { label: '오픈소스 분석', description: '실제 저장소와 코드를 읽고 프로젝트의 구조와 설계 선택을 살펴봅니다.' },
};

function readPost(category, file) {
  const fullPath = path.join(CONTENT_DIR, category, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, '');
  const date = String(data.publishedAt || '2026-01-01');

  return {
    slug,
    category,
    categoryLabel: CATEGORIES[category]?.label || category,
    title: data.title || slug,
    summary: data.summary || '',
    tag: data.tag || CATEGORIES[category]?.label || category,
    publishedAt: date,
    updatedAt: String(data.updatedAt || date),
    coverImage: data.coverImage || `/${category}/${slug}/opengraph-image`,
    content,
    readingMinutes: Math.max(
      1,
      Math.ceil(content.trim().split(/\s+/).length / 220)
    ),
  };
}

export function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return Object.keys(CATEGORIES).flatMap((category) => {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((file) => /\.mdx?$/.test(file))
      .map((file) => readPost(category, file));
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(category, slug) {
  if (!CATEGORIES[category] || !/^[a-zA-Z0-9가-힣_-]+$/.test(slug)) return null;
  const file = path.join(CONTENT_DIR, category, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return readPost(category, `${slug}.mdx`);
}

const STOP_WORDS = new Set([
  '그리고', '그러나', '때문에', '통해서', '대한', '위한', '경우', '기반',
  '설명', '정리', '방법', '이해', '실제', '사용', '문제', '해결',
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'using', 'into',
]);

function postKeywords(post) {
  const text = `${post.title} ${post.summary} ${post.tag}`.toLocaleLowerCase();
  return new Set(
    (text.match(/[가-힣]{2,}|[a-z0-9+#.-]{3,}/g) || [])
      .filter((word) => !STOP_WORDS.has(word))
  );
}

export function getRelatedPosts(post, limit = 3) {
  const targetKeywords = postKeywords(post);
  return getAllPosts()
    .filter((candidate) => (
      candidate.category !== post.category || candidate.slug !== post.slug
    ))
    .map((candidate) => {
      const candidateKeywords = postKeywords(candidate);
      const overlap = [...targetKeywords].filter((word) => candidateKeywords.has(word)).length;
      const sameTag = candidate.tag && candidate.tag === post.tag;
      const sameCategory = candidate.category === post.category;

      // 최근 글을 무조건 추천하지 않고 주제 유사도를 우선하며, 동점일 때만 최신순으로 정렬한다.
      const score = overlap * 2 + (sameTag ? 2 : 0) + (sameCategory ? 1 : 0);
      return { candidate, score };
    })
    .sort((a, b) => (
      b.score - a.score ||
      b.candidate.publishedAt.localeCompare(a.candidate.publishedAt)
    ))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, '');
}
