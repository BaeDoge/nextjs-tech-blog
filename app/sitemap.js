import { getAllPosts, getSiteUrl } from '@/lib/posts';

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
    },
    ...categories.map((category) => ({
      url: `${base}/category/${category}`,
      lastModified: latestDate(posts.filter((post) => post.category === category)),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...staticPages.map((page) => ({
      url: `${base}${page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...posts.map((post) => ({
      url: `${base}/${post.category}/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
