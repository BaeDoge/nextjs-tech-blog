import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SITE_URL = 'https://baejoon.vercel.app';

export const DEFAULT_LOCALE = 'ko';
export const SUPPORTED_LOCALES = ['ko', 'en'];

export const CATEGORIES = {
  algorithm: { label: '알고리즘', description: '문제 풀이와 핵심 알고리즘을 단계별로 정리합니다.' },
  troubleshooting: { label: '트러블슈팅', description: '개발 중 마주친 오류의 원인과 해결 과정을 기록합니다.' },
  paper: { label: '논문', description: 'AI, 소프트웨어, 컴퓨터 시스템 등 개발과 연결되는 연구를 쉽게 풀어봅니다.' },
  opensource: { label: '오픈소스 분석', description: '실제 저장소와 코드를 읽고 프로젝트의 구조와 설계 선택을 살펴봅니다.' },
};

export const EN_CATEGORIES = {
  algorithm: { label: 'Algorithms', description: 'Step-by-step explanations of coding problems, data structures, and core algorithms.' },
  troubleshooting: { label: 'Troubleshooting', description: 'Reproducible debugging notes covering errors, root causes, and practical fixes.' },
  paper: { label: 'Research Papers', description: 'Accessible explanations of research in AI, software, and computer systems.' },
  opensource: { label: 'Open Source', description: 'Codebase walkthroughs exploring project architecture and engineering decisions.' },
};

export function getCategories(locale = DEFAULT_LOCALE) {
  return locale === 'en' ? EN_CATEGORIES : CATEGORIES;
}

function contentDirectory(locale, category) {
  return locale === 'en'
    ? path.join(CONTENT_DIR, 'en', category)
    : path.join(CONTENT_DIR, category);
}

function readPost(category, file, locale = DEFAULT_LOCALE) {
  const fullPath = path.join(contentDirectory(locale, category), file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, '');
  const date = String(data.publishedAt || '2026-01-01');
  const categoryMap = getCategories(locale);

  return {
    slug,
    category,
    locale,
    categoryLabel: categoryMap[category]?.label || category,
    title: data.title || slug,
    summary: data.summary || '',
    tag: data.tag || categoryMap[category]?.label || category,
    publishedAt: date,
    updatedAt: String(data.updatedAt || date),
    coverImage: data.coverImage || `/${locale === 'en' ? 'en/' : ''}${category}/${slug}/opengraph-image`,
    content,
    readingMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220)),
  };
}

export function getAllPosts(locale = DEFAULT_LOCALE) {
  if (!SUPPORTED_LOCALES.includes(locale)) return [];
  const categoryMap = getCategories(locale);
  return Object.keys(categoryMap).flatMap((category) => {
    const dir = contentDirectory(locale, category);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((file) => /\.mdx?$/.test(file))
      .map((file) => readPost(category, file, locale));
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(category, slug, locale = DEFAULT_LOCALE) {
  if (!getCategories(locale)[category] || !/^[a-zA-Z0-9가-힣_-]+$/.test(slug)) return null;
  const file = path.join(contentDirectory(locale, category), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return readPost(category, `${slug}.mdx`, locale);
}

export function hasPostTranslation(category, slug) {
  return Boolean(getPost(category, slug, 'en'));
}

export function getPostPath(post, locale = post.locale || DEFAULT_LOCALE) {
  return locale === 'en'
    ? `/en/${post.category}/${post.slug}`
    : `/${post.category}/${post.slug}`;
}

export function getCategoryPath(category, locale = DEFAULT_LOCALE) {
  return locale === 'en' ? `/en/category/${category}` : `/category/${category}`;
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

export function getRelatedPosts(post, limit = 3, locale = post.locale || DEFAULT_LOCALE) {
  const targetKeywords = postKeywords(post);
  return getAllPosts(locale)
    .filter((candidate) => candidate.category !== post.category || candidate.slug !== post.slug)
    .map((candidate) => {
      const candidateKeywords = postKeywords(candidate);
      const overlap = [...targetKeywords].filter((word) => candidateKeywords.has(word)).length;
      const sameTag = candidate.tag && candidate.tag === post.tag;
      const sameCategory = candidate.category === post.category;
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
