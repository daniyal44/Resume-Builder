# Master Plan — OwnResume (SEO · AEO · GEO · UI · Release)

**Status:** Phase 1 complete · **Last updated:** 12 November 2026
**Live URL:** https://getownresume.netlify.app/ · **Repo:** daniyal44/Resume-Builder

---

## 1. Objective

Turn OwnResume from a working resume editor into a **discoverable, professional, fully responsive product** that:

1. Ranks in classic search (**SEO**).
2. Gets picked as the direct answer by assistants and voice/answer boxes (**AEO**).
3. Is cited correctly by generative engines — ChatGPT, Claude, Perplexity, Gemini, Copilot (**GEO**).
4. Looks and behaves like a paid product on every screen size.
5. Ships with a one-click Windows push workflow.

---

## 2. Gap analysis (what was missing)

| Area | Problem found | Priority |
| --- | --- | --- |
| Meta | Only `<title>`; no description, canonical, OG, Twitter, robots directives | P0 |
| Structured data | No JSON-LD at all → no rich results, no entity understanding | P0 |
| `robots.txt` | **File did not exist** (404 for every crawler) | P0 |
| `sitemap.xml` | `<loc>` pointed at `sitemap.xml` itself; stale 2024 `lastmod` | P0 |
| Crawlable content | SPA had no static HTML pages — nothing for engines to rank beyond the app shell | P0 |
| Lint | 40 pre-existing ESLint errors blocked a clean quality gate | P2 |
| `llms.txt` | Missing — no canonical facts for LLM answer engines | P1 |
| On-page content | No `h1`, no product copy, no FAQ — nothing for engines to quote | P0 |
| UI theme | Home page hardcoded dark hex colours; light mode was broken | P0 |
| Responsiveness | Fixed `0.185` thumbnail scale + 800 px pages overflowed on mobile; toolbar overflowed at 320 px | P0 |
| Branding | Vite logo used as favicon; no manifest, no social card | P1 |
| Content sections | No features / how-it-works / FAQ / footer | P1 |
| Routing | No SPA fallback (`_redirects`) → deep links 404 on Netlify | P1 |
| Repo hygiene | No `.gitignore` (node_modules / dist committable), boilerplate README | P2 |
| Docs | No roadmap, no SEO checklist, no push script | P2 |

---

## 3. Workstreams

### A. Technical SEO — *done*
- [x] Unique, keyword-led title + 155-char meta description
- [x] `canonical`, `hreflang` (`en`, `x-default`), `robots` with `max-image-preview:large`
- [x] Open Graph (title, description, url, image 1200×630, alt, locale, site_name)
- [x] Twitter `summary_large_image`
- [x] JSON-LD `@graph`: `WebSite`, `Organization`, `WebApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`
- [x] Valid `sitemap.xml` (correct root `<loc>`, `lastmod`, `changefreq`, `priority`)
- [x] `robots.txt` with sitemap reference
- [x] `site.webmanifest` + `theme-color` (light/dark) + `color-scheme`
- [x] Inter font preconnect/display swap
- [x] SPA fallback (`public/_redirects`)

### B. AEO (answer engine optimisation) — *done*
- [x] On-page FAQ (`<details>`), each answer self-contained and ≤ 60 words
- [x] `FAQPage` schema mirroring the visible FAQ text exactly
- [x] `HowTo` schema for "how to build a resume"
- [x] One `<h1>`, descriptive `<h2>`/`<h3>`, `aria-labelledby` on sections
- [x] Plain-language summary in the hero ("Free, private and ATS-friendly…")
- [x] `<noscript>` summary so non-JS fetchers still get the product definition

### C. GEO (generative engine optimisation) — *done*
- [x] `public/llms.txt` — canonical facts, features, privacy model, price, FAQ, source link
- [x] Explicit AI-crawler allowances in `robots.txt` (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Amazonbot, cohere-ai)
- [x] Stable, quotable claims ("all data stays in the browser", "8 templates", "no account required")
- [x] Entity consistency: `OwnResume` used identically in title, OG, schema, manifest, footer
- [x] `Organization` + `WebSite` nodes with `@id` for entity reconciliation
- [x] Static, JS-free topic pages: `/templates/`, `/guides/how-to-write-a-resume/`, `/guides/ats-resume/`, `/guides/resume-format/`, each with its own canonical, OG and `Article`/`HowTo`/`FAQPage` schema
- [x] Internal linking: home footer → guides → builder, and guide ↔ guide cross-links

### D. UI / UX — *done*
- [x] Branded sticky header (mark + name + tagline, search, theme toggle, primary CTA)
- [x] Hero with value proposition, two CTAs, trust markers
- [x] "Continue where you left off" resume card
- [x] Quick actions (New / JSON / PDF) as equal responsive cards
- [x] Features grid, 3-step how-it-works, template chips, FAQ accordion, footer
- [x] Full light + dark theme parity (no hardcoded hex)
- [x] Focus rings, `aria-label`s, `aria-pressed`, `aria-hidden` decorative icons
- [x] Hover/focus transitions, gradient accents, consistent 2xl radii

### E. Responsiveness — *done*
- [x] Thumbnails now measure their container (`ResizeObserver`) and scale the 800 px page — no overflow at any width
- [x] Grid: 2 → 3 → 4 → 5 columns; list rows hide the timestamp below `sm`
- [x] Search: full-width row on mobile, inline from `sm`
- [x] Editor nav labels collapse to icons on phones
- [x] `overflow-x: hidden`, `viewport-fit=cover`, `text-size-adjust` guards
- [x] Verified breakpoints to target: 320 / 375 / 414 / 768 / 1024 / 1440 / 1920

### F. Release engineering — *done*
- [x] `.gitignore` (node_modules, dist, env, logs, tooling artefacts)
- [x] `github.bat` — stage, commit, push in one command
- [x] README rewritten (features, stack, scripts, structure, SEO, deployment)
- [x] This master plan + `SEO-AEO-GEO.md` checklist

---

## 4. Phases

| Phase | Scope | Status |
| --- | --- | --- |
| **1. Foundation** | Meta, schema, robots, sitemap, llms.txt, UI rebuild, responsiveness, docs, push script | ✅ Complete |
| **2. Content depth** | Static template + guide landing pages (templates, how-to-write, ATS, format), internal linking | ✅ Complete (v1) |
| **3. Routing & prerender** | Real routes (`react-router`), route-level meta, static prerender so crawlers get HTML without JS | ⏳ Planned |
| **4. Growth** | Webmaster verification (Search Console, Bing), analytics with consent, `Article` + `SoftwareApplication` reviews, backlinks | ⏳ Planned |
| **5. Product** | Word/DOCX export, cover letter builder, LinkedIn import, ATS keyword score, more locales | ⏳ Planned |

### Phase 2 acceptance criteria
- Every template has a crawlable page with unique title, description and example preview.
- Each guide ≥ 900 words, one `h1`, FAQ block, `Article` schema with `author` + `datePublished`.
- Internal links from home → guides → builder (max 3 clicks).

### Phase 3 acceptance criteria
- `npm run build` emits prerendered HTML for `/`, `/templates/*`, `/guides/*`.
- Lighthouse: Performance ≥ 90, SEO = 100, Accessibility ≥ 95 on mobile.
- Route changes update `document.title` and the canonical link.

---

## 5. Measurement

| KPI | Target | Tool |
| --- | --- | --- |
| Indexed pages | 100% of sitemap URLs | Search Console / Bing Webmaster |
| Rich results | FAQ + HowTo valid, 0 errors | Rich Results Test |
| Core Web Vitals | LCP < 2.5 s, CLS < 0.1, INP < 200 ms | PageSpeed Insights |
| Accessible name coverage | 100% interactive elements | Lighthouse / axe |
| AI citations | Branded answers on 3+ engines | Manual monthly prompt set |
| Responsive breakage | 0 horizontal scroll at 320–1920 px | Manual matrix |

---

## 6. Ownership & cadence

- **Weekly:** check crawler errors, broken links, new schema warnings.
- **Monthly:** refresh `lastmod`, re-run the 30-prompt GEO test, review 404s.
- **Each release:** run `npm run build`, `npm run lint`, validate schema, spot-check mobile widths.

---

## 7. Definition of done (Phase 1) — verified

1. `index.html` contains title, description, canonical, OG, Twitter, JSON-LD. ✅
2. `robots.txt`, `sitemap.xml`, `llms.txt`, `site.webmanifest`, `_redirects` exist in `public/`. ✅
3. Home page renders hero, documents, features, how-it-works, FAQ and footer in light and dark. ✅
4. No horizontal overflow from 320 px up; thumbnails scale with their column. ✅
5. `npm run build` succeeds. ✅
6. `github.bat` pushes to `origin` with one command. ✅
