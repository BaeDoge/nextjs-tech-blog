import { getAllPosts, getSiteUrl, EN_CATEGORIES, hasPostTranslation } from '@/lib/posts';

export default function sitemap() {
  const base = getSiteUrl();
  const posts = getAllPosts();
  const latestDate = (items) => {
    const value = items
      .map((post) => post.updatedAt || post.publishedAt)
      .filter(Boolean)
      .sort()
      .at(-1);
    return value ? new Date(value) : undefined;
  };

  const categories = ['algorithm', 'troubleshooting', 'paper', 'opensource'];
  const englishPosts = getAllPosts('en');
  const englishStaticPages = ['/en/about', '/en/contact', '/en/privacy', '/en/lab'];

  const staticPages = [
    { path: '/about', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
  ];

  return [
    {
      url: base,
      lastModified: latestDate(posts),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: { ko: base, en: `${base}/en` } },
    },
    {
      url: `${base}/en`,
      lastModified: latestDate(englishPosts),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: { ko: base, en: `${base}/en` } },
    },
    ...categories.map((category) => ({
      url: `${base}/category/${category}`,
      lastModified: latestDate(posts.filter((post) => post.category === category)),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { ko: `${base}/category/${category}`, en: `${base}/en/category/${category}` } },
    })),
    ...categories.map((category) => ({
      url: `${base}/en/category/${category}`,
      lastModified: latestDate(englishPosts.filter((post) => post.category === category)),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: { languages: { ko: `${base}/category/${category}`, en: `${base}/en/category/${category}` } },
    })),
    ...staticPages.map((page) => ({
      url: `${base}${page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: { ko: `${base}${page.path}`, en: `${base}/en${page.path}` } },
    })),
    ...englishStaticPages.map((url) => ({
      url: `${base}${url}`,
      changeFrequency: 'monthly',
      priority: 0.3,
    })),
    ...posts.map((post) => ({
      url: `${base}/${post.category}/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
      ...(hasPostTranslation(post.category, post.slug)
        ? { alternates: { languages: { ko: `${base}/${post.category}/${post.slug}`, en: `${base}/en/${post.category}/${post.slug}` } } }
        : {}),
    })),
    ...englishPosts.map((post) => ({
      url: `${base}/en/${post.category}/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: { ko: `${base}/${post.category}/${post.slug}`, en: `${base}/en/${post.category}/${post.slug}` } },
    })),
  ];
}
