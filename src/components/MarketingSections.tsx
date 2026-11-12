import React from 'react';
import { Sparkles, ShieldCheck, Gauge, LayoutTemplate, Download, FileSearch, Check } from 'lucide-react';

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: '8 professional templates',
    body: 'Classic, Modern Sidebar, Bold Header, Professional Split, Minimal, Elegant Minimal, Creative Grid and Pikachu — each with a custom accent colour.',
  },
  {
    icon: Gauge,
    title: 'ATS-friendly by default',
    body: 'Every export is real selectable text with standard section headings, so applicant tracking systems can read your name, roles and skills.',
  },
  {
    icon: FileSearch,
    title: 'Import what you already have',
    body: 'Drop in a text-based PDF and OwnResume maps the content into the right fields, or restore a JSON backup in one click.',
  },
  {
    icon: Download,
    title: 'Pixel-perfect PDF export',
    body: 'A true A4 page with no browser headers or footers — the PDF looks exactly like the live preview you approved.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    body: 'Your resume lives in your own browser storage. No account, no upload, no tracking of your personal details.',
  },
  {
    icon: Sparkles,
    title: 'Guided, not overwhelming',
    body: 'A clear section-by-section form, live validation-free editing and autosave so you never lose a paragraph.',
  },
];

const STEPS = [
  { title: 'Start or import', body: 'Open a blank resume, import a PDF, or restore a JSON backup you exported earlier.' },
  { title: 'Fill in your story', body: 'Add summary, experience, projects, education, skills and languages in the guided form — it autosaves as you type.' },
  { title: 'Design & download', body: 'Pick a template and accent colour, check the live A4 preview, then export a PDF ready to send.' },
];

const FAQS = [
  {
    q: 'Is OwnResume really free?',
    a: 'Yes. Every template and every export option is unlocked. There is no account, no credit card and no trial limit.',
  },
  {
    q: 'Where is my resume data stored?',
    a: 'Only in your own browser (localStorage). Nothing is uploaded to a server, so your personal details never leave your device. You can export a JSON backup at any time.',
  },
  {
    q: 'Can I import an existing resume?',
    a: 'You can import a text-based PDF, which is parsed into the resume form, or restore a JSON backup. Image-only scanned PDFs cannot be read.',
  },
  {
    q: 'Are the templates ATS-friendly?',
    a: 'Yes. Every template exports real text with conventional section headings, so applicant tracking systems can parse your experience, education and skills.',
  },
  {
    q: 'Do I need an account to download my résumé?',
    a: 'No. You can create, preview and download your resume as a PDF without signing up or sharing an email address.',
  },
];

const TEMPLATES = [
  'Classic',
  'Modern Sidebar',
  'Bold Header',
  'Professional Split',
  'Minimal',
  'Elegant Minimal',
  'Creative Grid',
  'Pikachu',
];

const MarketingSections: React.FC = () => (
  <>
    {/* ─── Features ─────────────────────────────────────────────────────────── */}
    <section id="features" className="scroll-mt-24 mt-20 sm:mt-28">
      <div className="max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
          Why OwnResume
        </p>
        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Everything a modern resume needs — nothing it doesn&apos;t
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          A focused builder for job seekers who want a clean, credible document in minutes. No paywalls, no watermarks,
          no account to forget.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <article
            key={title}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-[#141418] dark:hover:border-zinc-700 dark:hover:shadow-black/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{body}</p>
          </article>
        ))}
      </div>
    </section>

    {/* ─── How it works ─────────────────────────────────────────────────────── */}
    <section id="how-it-works" className="scroll-mt-24 mt-20 sm:mt-28">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        How it works
      </h2>
      <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
        Build a recruiter-ready resume in three steps, usually in under ten minutes.
      </p>

      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="relative rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-[#141418]"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {i + 1}
            </span>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-50">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
          Templates
        </span>
        {TEMPLATES.map(t => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-[#141418] dark:text-zinc-300"
          >
            <Check className="h-3 w-3 text-emerald-500" aria-hidden="true" />
            {t}
          </span>
        ))}
      </div>
    </section>

    {/* ─── FAQ (AEO / GEO) ──────────────────────────────────────────────────── */}
    <section id="faq" className="scroll-mt-24 mt-20 sm:mt-28">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        Frequently asked questions
      </h2>
      <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
        Short answers to what people ask most about building a resume with OwnResume.
      </p>

      <div className="mt-6 divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-[#141418]">
        {FAQS.map(item => (
          <details key={item.q} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {item.q}
              <span className="shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  </>
);

export default MarketingSections;
