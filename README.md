# OwnResume — Free AI Resume Builder

A fast, private, fully responsive resume builder built with **React 19 + TypeScript + Vite + Tailwind CSS v4**.
Create an ATS-friendly resume in minutes, preview the exact A4 page live, import an existing PDF, and export a
pixel-perfect PDF — without an account, a paywall or an upload.

> **Live:** https://getownresume.netlify.app/

[![Live site](https://img.shields.io/badge/live-getownresume.netlify.app-3b82f6?style=flat-square&logo=netlify&logoColor=white)](https://getownresume.netlify.app/)
[![CI](https://img.shields.io/github/actions/workflow/status/daniyal44/Resume-Builder/ci.yml?branch=main&style=flat-square&label=lint%20%26%20build)](https://github.com/daniyal44/Resume-Builder/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-087ea4?style=flat-square&logo=react&logoColor=white)](package.json)
[![Vite 8](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white)](package.json)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](package.json)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-a855f7?style=flat-square)](CONTRIBUTING.md)

---

## ✨ Features

| Feature | Description |
| --- | --- |
| **8 templates** | Classic · Modern Sidebar · Bold Header · Professional Split · Minimal · Elegant Minimal · Creative Grid · Pikachu |
| **Live A4 preview** | Edit, preview or split view; the preview scales to any screen width |
| **PDF import** | Text-based PDFs are parsed and mapped into the form fields |
| **JSON backup** | Export and restore the complete resume model |
| **PDF export** | Real A4, no browser headers/footers, no watermark |
| **Autosave** | Every keystroke persists to `localStorage` under a stable resume id |
| **Light & dark** | Theme-aware UI with system-aware defaults |
| **Responsive** | Verified layouts from 320 px phones to ultrawide desktops |
| **SEO / AEO / GEO** | Structured data, sitemap, robots policy, `llms.txt`, on-page FAQ |

## 🧱 Tech stack

- **React 19** + **TypeScript 5.9**
- **Vite 8** build tooling
- **Tailwind CSS v4** (`@tailwindcss/vite`) with a `dark` custom variant
- **pdfjs-dist** for PDF text extraction
- **react-to-print** for PDF output
- **lucide-react** icons

## 🚀 Getting started

```bash
# 1. Install (lockfile is committed — use npm ci for reproducible builds)
npm ci

# 2. Start the dev server
npm run dev          # http://localhost:5173

# 3. Production build
npm run build        # type-check + bundle into dist/

# 4. Preview the production build
npm run preview

# 5. Lint
npm run lint
```

Node 20+ is recommended.

## 📁 Project structure

```
public/
  favicon.svg          # brand mark
  og-image.png         # 1200x630 social / AI answer card
  robots.txt           # crawler policy + explicit AI-bot allow list
  sitemap.xml          # all crawlable URLs
  llms.txt             # answer-engine summary (GEO)
  site.webmanifest     # installable PWA metadata
  _redirects           # Netlify SPA fallback
  _headers             # security + cache headers
  404.html             # branded not-found page
  static-pages.css     # shared stylesheet for the static SEO pages
  templates/           # crawlable "free resume templates" landing page
  guides/
    how-to-write-a-resume/   # resume writing guide
    ats-resume/              # ATS optimisation guide
    resume-format/           # format, sections and length guide
src/
  components/
    HomePage.tsx           # dashboard, hero, document grid
    MarketingSections.tsx  # features, how it works, FAQ, footer content
    ResumePreview.tsx      # template dispatcher
    forms/                 # section-by-section editor
    templates/             # 8 resume layouts
  services/
    storage.ts          # localStorage persistence
    pdfParser.ts        # PDF → ResumeData mapping
  types/resume.ts       # shared data model
index.html             # SEO/AEO/GEO head (meta, OG, JSON-LD)
```

## 🔍 SEO / AEO / GEO

Implemented in `index.html` and `public/`:

- Descriptive title, meta description, keywords, canonical, `hreflang`
- Open Graph + Twitter `summary_large_image` cards with a 1200×630 image
- JSON-LD `@graph`: `WebSite`, `Organization`, `WebApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`
- Semantic single `h1` per screen, ordered `h2`/`h3`, landmarks (`header`/`main`/`footer`/`nav`)
- On-page FAQ that mirrors the `FAQPage` schema (AEO/GEO answer extraction)
- `robots.txt` with explicit allowances for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended…
- `llms.txt` for LLM answer engines, plus a valid `sitemap.xml`

**Crawlable content pages.** Because the builder is a client-rendered SPA, ranking content lives in four static HTML
pages built without JavaScript: `/templates/`, `/guides/how-to-write-a-resume/`, `/guides/ats-resume/` and
`/guides/resume-format/`. Each has its own title, description, canonical, OG tags and `Article`/`HowTo`/`FAQPage`
schema, and they interlink with the builder and each other.

See [SEO-AEO-GEO.md](SEO-AEO-GEO.md) for the audit checklist and [MASTER_PLAN.md](MASTER_PLAN.md) for the roadmap.

## 🔒 Privacy

Resume content is stored only in the visitor's browser (`localStorage`). There is no backend, no analytics on resume
content, and no upload of personal data. Clearing site data or exporting JSON is fully in the user's control.

## 📦 Deployment

The app is a static SPA and deploys to any static host.

**Netlify** — build command `npm run build`, publish directory `dist`. `public/_redirects` already provides the SPA
fallback.

**GitHub Pages** — set `base: '/<repo-name>/'` in `vite.config.ts` when hosting under a project path.

### Push from Windows

`github.bat` stages everything, commits, rebase-syncs with `origin/main` and pushes in one
step. It refuses to run outside a git repo, and stops before pushing if the rebase conflicts.

```bat
github.bat                          :: default commit message
github.bat "fix: mobile layout"     :: your own commit message
github.bat "feat: split view" --build  :: lint + build first, then push
github.bat --help                   :: usage
```

### Continuous integration

GitHub Actions runs `npm ci`, `npm run lint` and `npm run build` on Node 20 and 22 for every
push and pull request to `main` (`.github/workflows/ci.yml`), and then checks that the crawlable
static pages and SEO files exist in `dist/`. Dependabot keeps npm and Actions up to date.

## 🤝 Contributing

Contributions are welcome — new templates, form UX, accessibility and the SEO pages all help.
Read [CONTRIBUTING.md](CONTRIBUTING.md) first, and report security issues privately per
[SECURITY.md](SECURITY.md).

## 📄 License

[MIT](LICENSE) © 2026 Daniyal — free for personal and commercial use, including generated resumes.
