# Baejoon — 함께 공부합시다

A technical learning blog for recording development problems, practical solutions, algorithm exercises, paper reviews, and open-source projects.

- **Live site:** https://baejoon.vercel.app
- **Content:** Algorithms, troubleshooting, paper reviews, and open-source analysis
- **Deployment:** Vercel

## Features

- Responsive home page, category pages, and article pages
- Markdown and MDX content organised by topic
- Search, related articles, and estimated reading time
- Code examples and visual components for practical explanations
- SEO metadata, canonical URLs, sitemap, robots.txt, and structured article data

## Technology

- Next.js App Router
- React
- MDX and Markdown
- CSS
- Vercel

## Run locally

Requirements: Node.js 20 or later and npm.

    git clone https://github.com/BaeDoge/nextjs-tech-blog.git
    cd nextjs-tech-blog
    npm ci
    npm run dev

Open http://localhost:3000.

Create a production build with:

    npm run build

## Add an article

Add an MDX file to the matching content directory:

    content/
      algorithm/
      troubleshooting/
      paper/
      opensource/

Use the frontmatter fields supported by the existing articles, including title, summary, date, and category metadata. Keep code examples reproducible and include links to original documentation, papers, or repositories where appropriate.

## Content and editorial approach

The site is maintained as a practical engineering notebook. Articles may be prepared with AI-assisted research or drafting, but technical claims, external references, and code samples should be checked before publication.

## Contributing

Issues and pull requests are welcome. For substantial changes, please open an issue first to discuss the proposed behaviour or content structure.

## Licence

See LICENSE for the licence applicable to this repository.
