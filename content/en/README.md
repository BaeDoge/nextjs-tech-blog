# English article content

English articles live under `content/en/<category>/<slug>.mdx`.

Keep the category and slug identical to the Korean source so that the language switcher can map between editions:

- Korean: `content/troubleshooting/example-error.mdx`
- English: `content/en/troubleshooting/example-error.mdx`

Use the same frontmatter keys (`title`, `publishedAt`, `updatedAt`, `summary`, `tag`, and optional `coverImage`). Keep images and code assets shared where appropriate, but translate visible captions, callouts, diagram labels, and alt text. Preserve code behavior, version numbers, source links, and technical meaning.

Only create an English file after the translation has been reviewed. Until then, the English route displays a translation-in-progress message and is marked `noindex`; it never presents the Korean body as English.
