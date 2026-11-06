/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  async redirects() {
    return [
      ...['paper-review-20261106-091633', 'paper-review-20261106-092339',
        'paper-review-20261106-093914', 'paper-review-20261106-094242'].map((slug) => ({
        source: `/troubleshooting/${slug}`,
        destination: `/paper/${slug}`,
        permanent: true,
      })),
    ];
  },
};
export default nextConfig;
