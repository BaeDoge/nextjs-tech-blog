import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
export const CATEGORIES = {
  algorithm: { label: '알고리즘', description: '문제 풀이와 핵심 알고리즘을 단계별로 정리합니다.' },
  troubleshooting: { label: '트러블슈팅', description: '개발 중 마주친 오류의 원인과 해결 과정을 기록합니다.' },
};

function readPost(category, file) {
  const fullPath = path.join(CONTENT_DIR, category, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, '');
  const date = String(data.publishedAt || '2026-01-01');
  return {
    slug, category, categoryLabel: CATEGORIES[category]?.label || category,
    title: data.title || slug, summary: data.summary || '', tag: data.tag || CATEGORIES[category]?.label || category,
    publishedAt: date, updatedAt: String(data.updatedAt || date), content,
    readingMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220)),
  };
}

export function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return Object.keys(CATEGORIES).flatMap((category) => {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).map((f) => readPost(category, f));
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
export function getPost(category, slug) {
  if (!CATEGORIES[category] || !/^[a-zA-Z0-9가-힣_-]+$/.test(slug)) return null;
  const file = path.join(CONTENT_DIR, category, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return readPost(category, `${slug}.mdx`);
}
export function getRelatedPosts(post, limit = 3) {
  return getAllPosts().filter((p) => p.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, limit);
}
export function getSiteUrl() { return (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com').replace(/\/$/, ''); }
