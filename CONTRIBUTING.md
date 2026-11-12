# Contributing to OwnResume

Thanks for helping out. OwnResume is a free, private, account-free resume builder, and
contributions of every size are welcome — a typo fix, a new template, or an accessibility
improvement.

## Getting started

```bash
npm ci          # reproducible install from the lockfile
npm run dev     # http://localhost:5173
npm run lint    # ESLint
npm run build   # type-check + production bundle
```

Node 20 or newer. There is no backend: everything runs in the browser and resume data is
stored in `localStorage`.

## Project layout

| Path | What lives there |
| --- | --- |
| `src/components/forms/` | Section-by-section editor fields |
| `src/components/templates/` | The eight A4 resume layouts |
| `src/components/HomePage.tsx` | Dashboard: hero, continue card, document grid |
| `src/components/MarketingSections.tsx` | On-page features / how-it-works / FAQ copy |
| `src/services/` | `localStorage` persistence and PDF parsing |
| `public/` | Static SEO/AEO pages, `robots.txt`, `sitemap.xml`, `llms.txt`, OG image |
| `index.html` | Meta tags and JSON-LD structured data |

## Adding a template

1. Create `src/components/templates/YourTemplate.tsx` — `forwardRef<HTMLDivElement>`, accepts
   `data: ResumeData`, renders a white page that prints to exactly one A4 sheet
   (`w-full min-h-[1131px]` at 800 px wide).
2. Read the accent colour from `data.accentColor` and fall back to a sensible default.
3. Register it in the template list used by `ResumePreview.tsx` and keep the id stable.
4. Add a row for it to the table in `README.md` and to `public/templates/index.html`.

## UI rules

- Everything must work from 320 px up. Test both light and dark themes.
- Use Tailwind utilities already in the file; avoid new global CSS.
- Interactive elements need an accessible name (`aria-label` or visible text) and a visible
  focus state. Do not remove `:focus-visible` outlines.
- Keep one `<h1>` per page and order headings without skipping levels.

## Content and SEO pages

The landing pages in `public/templates/` and `public/guides/` are plain HTML with no
JavaScript, because that is what crawlers and answer engines read. If you edit them, keep
the `<title>`, meta description, canonical URL, Open Graph tags and JSON-LD in sync.

## Commits and pull requests

- Commit messages follow `type: summary` — `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- One logical change per pull request; describe *why* in the body.
- `npm run lint` and `npm run build` must pass — CI runs both on Node 20 and 22.
- Never commit personal resume data, tokens, `.env` files or exported PDFs.

## Security

Please report vulnerabilities privately — see [SECURITY.md](SECURITY.md).
