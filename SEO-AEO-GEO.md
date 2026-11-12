# SEO · AEO · GEO — Implementation Checklist

Practical, copy-ready reference for OwnResume. Update it whenever the site's metadata, routes or content change.

---

## 1. What each acronym means here

| Term | Goal | Where it lives |
| --- | --- | --- |
| **SEO** — Search Engine Optimisation | Rank in Google/Bing for resume-builder queries | `index.html`, `sitemap.xml`, `robots.txt`, semantic HTML |
| **AEO** — Answer Engine Optimisation | Be the direct answer in featured snippets, People Also Ask, voice results | On-page FAQ, `FAQPage` + `HowTo` schema, question-shaped headings |
| **GEO** — Generative Engine Optimisation | Be cited accurately by ChatGPT, Claude, Perplexity, Gemini, Copilot | `llms.txt`, AI-crawler allowances, quotable facts, consistent entity naming |

---

## 2. Files that control discoverability

```
index.html                → title, description, canonical, OG, Twitter, JSON-LD
public/robots.txt         → crawl policy + 14 explicitly allowed AI agents
public/sitemap.xml        → canonical URL list (currently the single SPA route)
public/llms.txt           → one-page factual summary for LLM answer engines
public/site.webmanifest   → installable app metadata, name consistency
public/_redirects         → SPA fallback so every path returns 200 + index.html
public/google1ab7400cf65ca469.html  → Google Search Console site verification (must return `google-site-verification: google1ab7400cf65ca469.html` exactly, not the app HTML). Added to `_redirects` with `200!` force-serve rule so the crawler never falls through to `index.html`.
```

---

## 3. Keyword map

| Intent | Primary keyword | Supporting keywords | Page |
| --- | --- | --- | --- |
| Build a resume | free resume builder | resume maker online, CV builder free | `/` |
| Import | import resume from PDF | PDF to resume, resume parser | `/` |
| ATS | ATS friendly resume | ATS resume checker, keyword optimised CV | `/` + Phase 2 guide |
| Templates | professional resume templates | modern resume template, minimal CV template | Phase 2 `/templates/*` |
| Privacy | private resume builder | no sign-up resume builder, offline resume maker | `/` |

One primary intent per URL. Never compete with yourself on the same query.

---

## 4. On-page rules (enforced in code)

- Exactly **one `<h1>`** per screen (`HomePage` hero; editor uses the resume name as the page title).
- Section headings descend in order: `h1 → h2 → h3`, no skips.
- Landmarks: `<header>`, `<main>`, `<nav aria-label>`, `<footer>`.
- Anchor targets used by the sitemap/footer exist: `#builder`, `#features`, `#how-it-works`, `#faq`, `#top`.
- Every interactive element has an accessible name (`aria-label` for icon-only buttons).
- Decorative icons carry `aria-hidden="true"`.
- Images use meaningful `alt`; no text baked into images on the home page.
- FAQ answers are self-contained, factual and 30–60 words (ideal extraction length).
- Links: internal links are descriptive — never "click here".

---

## 5. Structured data coverage

| Type | Purpose | Required fields present |
| --- | --- | --- |
| `WebSite` | Site entity for Knowledge Graph | `url`, `name`, `description`, `inLanguage`, `publisher` |
| `Organization` | Brand entity, logo | `name`, `url`, `logo`, `description` |
| `WebApplication` | Product rich result | `name`, `applicationCategory`, `operatingSystem`, `offers`, `featureList` |
| `HowTo` | Step-by-step result | `name`, `totalTime`, 4 `HowToStep` |
| `FAQPage` | FAQ rich result | 5 `Question` + `acceptedAnswer` |
| `BreadcrumbList` | Path display | 2 `ListItem` |

**Validation:** paste the deployed URL into <https://search.google.com/test/rich-results> and
<https://validator.schema.org/>. Fix all errors before requesting indexing.

> Rule: schema text must match visible page text. Never mark up content that users cannot see.

---

## 6. robots.txt policy

- `User-agent: *` → `Allow: /`
- Explicit `Allow` blocks for search bots and 14 AI agents (GPTBot, OAI-SearchBot, ChatGPT-User,
  ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot,
  Applebot-Extended, Amazonbot, cohere-ai, CCBot, Bytespider).
- `Sitemap:` directive points at the absolute `sitemap.xml` URL.
- Never `Disallow: /assets/` — crawlers need CSS/JS to render the SPA.

If you later want to opt out of model training while staying citable in search answers, keep
`OAI-SearchBot` / `PerplexityBot` allowed and block only training bots (`GPTBot`, `CCBot`).

---

## 7. Sitemap maintenance

```xml
<url>
  <loc>https://getownresume.netlify.app/</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
</url>
```

- `<lastmod>` must change only when the page content meaningfully changes.
- Every new route must be added here **and** linked from the footer.
- Keep it under 50 000 URLs / 50 MB (not a risk at this size).
- Submit once in Search Console and Bing Webmaster Tools; resubmit after structural changes.

---

## 8. GEO playbook

1. **Answer the question in the first sentence.** Assistants quote the first 1–2 sentences.
2. **Keep facts stable and identical** across `llms.txt`, `llms-full.txt`, OG description, schema and page copy.
3. **State the differentiator plainly:** free, no account, browser-only data, ATS-friendly text output.
4. **Use lists and tables** — they survive extraction better than prose.
5. **Name the entity consistently:** `OwnResume` (never "resume builder app" as the subject).
6. **Refresh `llms.txt` monthly** and when pricing/features change.
7. **Monitor with a fixed prompt set**, e.g.:
   - "best free resume builder with no sign-up"
   - "how to import an existing resume from PDF"
   - "is OwnResume free?"
   - "ATS friendly resume builder online"
   Record whether the brand is mentioned and whether the facts are correct.

---

## 9. Performance budget (affects ranking)

| Metric | Budget | Current approach |
| --- | --- | --- |
| LCP | < 2.5 s | static host, single CSS bundle, Inter with `display=swap` |
| CLS | < 0.1 | reserved aspect-ratio boxes for previews |
| INP | < 200 ms | local state, no network on keystroke |
| JS (gzip) | < 250 kB initial | pdfjs loaded lazily by the import flow |

---

## 10. Release checklist

- [ ] `npm run build` passes
- [ ] `npm run lint` clean
- [ ] Title ≤ 60 chars, description 140–160 chars
- [ ] Canonical + OG URLs match the deployed origin
- [ ] OG image loads at 1200×630 (`/og-image.png`)
- [ ] JSON-LD validates with 0 errors
- [ ] `robots.txt`, `sitemap.xml`, `llms.txt` reachable and correct
- [ ] One `h1`, no skipped heading levels
- [ ] Light/dark and 320 → 1920 px spot-checked
- [ ] Search Console: request indexing for changed URLs
- [ ] Google site verification file `public/google1ab7400cf65ca469.html` is deployed and returns the exact verification line (not app HTML) — confirmed via `curl https://<site>/google1ab7400cf65ca469.html`
