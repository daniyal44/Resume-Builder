import React, { useEffect, useRef, useState } from 'react';
import {
  FileText, Plus, Download, Grid, List, Trash2, MoreVertical,
  Search, SortAsc, Clock, Sparkles, ShieldCheck, Moon, Sun, ArrowRight
} from 'lucide-react';
import type { SavedResume } from '../services/storage';
import ResumePreview from './ResumePreview';
import MarketingSections from './MarketingSections';

interface Props {
  resumes: SavedResume[];
  isDarkMode: boolean;
  onToggleDark: () => void;
  onCreate: () => void;
  onImportJSON: () => void;
  onImportPDF: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

type SortKey = 'updatedAt' | 'name';
type ViewMode = 'grid' | 'list';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* ─── Responsive thumbnail: measures its own width and scales the 800px page ── */
function useThumbScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.24);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / 800);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, scale };
}

const ResumeCard: React.FC<{
  resume: SavedResume;
  viewMode: ViewMode;
  onOpen: () => void;
  onDelete: () => void;
}> = ({ resume, viewMode, onOpen, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { ref: thumbRef, scale } = useThumbScale();

  const title = resume.data.header.fullName || 'Untitled Resume';
  const subtitle = resume.data.header.headline || 'Resume';

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(v => !v);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={onOpen}
        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 sm:gap-4 sm:px-5 dark:border-zinc-800 dark:bg-[#17171b] dark:hover:border-zinc-700 dark:hover:bg-[#1d1d22]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <FileText className="h-5 w-5 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</div>
          <div className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-500">{subtitle}</div>
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 text-xs text-zinc-500 sm:flex dark:text-zinc-500">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(resume.updatedAt)}
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={toggleMenu}
            aria-label={`Options for ${title}`}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-50 w-40 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-[#232328]">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-zinc-700/50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onOpen}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/10 dark:border-zinc-800 dark:bg-[#17171b] dark:hover:border-zinc-600 dark:hover:shadow-black/50"
    >
      {/* Live thumbnail — scales to the card width at any screen size */}
      <div
        ref={thumbRef}
        className="relative overflow-hidden border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        style={{ aspectRatio: '800 / 1131' }}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: '800px', height: '1131px', transform: `scale(${scale})` }}
        >
          <ResumePreview data={resume.data} scale={1} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/25">
          <span className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            Open
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</div>
          <div className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-500">
            Updated {formatDate(resume.updatedAt)}
          </div>
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={toggleMenu}
            aria-label={`Options for ${title}`}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 sm:opacity-0 sm:group-hover:opacity-100 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute bottom-10 right-0 z-50 w-40 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-[#232328]">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-zinc-700/50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickAction: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  accent: string;
}> = ({ icon, title, desc, onClick, accent }) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5 sm:gap-4 sm:p-5 dark:border-zinc-800 dark:bg-[#17171b] dark:hover:border-zinc-700"
  >
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${accent}`}>
      {icon}
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-50">{title}</span>
      <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-500">{desc}</span>
    </span>
  </button>
);

const HomePage: React.FC<Props> = ({
  resumes, isDarkMode, onToggleDark, onCreate, onImportJSON, onImportPDF, onOpen, onDelete,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [search, setSearch] = useState('');

  const sorted = [...resumes]
    .filter(r =>
      (r.data.header.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.data.header.headline || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortKey === 'updatedAt'
        ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        : (a.data.header.fullName || '').localeCompare(b.data.header.fullName || '')
    );

  const hasResumes = resumes.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 transition-colors duration-200 dark:bg-[#0d0d10] dark:text-zinc-100">
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-[#0d0d10]/90">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-sm">
              <FileText className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">OwnResume</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                Free resume builder
              </span>
            </span>
          </a>

          <div className="relative ml-auto hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resumes…"
              aria-label="Search resumes"
              className="w-44 rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-3 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:w-56 dark:border-zinc-800 dark:bg-[#17171b] dark:text-zinc-200 dark:placeholder-zinc-500"
            />
          </div>

          <button
            onClick={onToggleDark}
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            className="ml-auto rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:ml-0 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onCreate}
            className="hidden items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 sm:inline-flex dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> New resume
          </button>
        </div>

        {/* Mobile search row */}
        <div className="border-t border-zinc-100 px-4 py-2.5 sm:hidden dark:border-zinc-800/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resumes…"
              aria-label="Search resumes"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-8 pr-3 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-[#17171b] dark:text-zinc-200"
            />
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        {/* ─── Hero ─────────────────────────────────────────────────────────── */}
        <section className={hasResumes ? 'mb-10' : 'mb-12 sm:mb-16'}>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
            {hasResumes ? (
              <>
                Your resumes,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
                  always ready to send.
                </span>
              </>
            ) : (
              <>
                Build a resume that{' '}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
                  gets past the bots
                </span>{' '}
                and impresses the humans.
              </>
            )}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
            Free, private and ATS-friendly. Eight professional templates, a live A4 preview, PDF import and one-click
            PDF export — with everything stored in your own browser.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={onCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Start building — it&apos;s free
            </button>
            <button
              onClick={onImportPDF}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
            >
              Import an existing PDF <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-500 dark:text-zinc-500">
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> No sign-up required
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> Data stays on your device
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> No watermark
            </li>
          </ul>
        </section>

        {/* ─── Continue where you left off ──────────────────────────────────── */}
        {sorted.length > 0 && (
          <section aria-labelledby="continue-heading" className="mb-10">
            <h2 id="continue-heading" className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
              Continue where you left off
            </h2>
            <button
              onClick={() => onOpen(sorted[0].id)}
              className="group relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-4 text-left transition-all duration-300 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5 sm:gap-6 sm:p-6 dark:border-zinc-800 dark:from-[#1a1a1f] dark:to-[#141418] dark:hover:border-zinc-700"
            >
              <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-violet-500" aria-hidden="true" />
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14 dark:bg-blue-500/10 dark:text-blue-400">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-bold text-zinc-900 transition-colors group-hover:text-blue-600 sm:text-lg dark:text-white dark:group-hover:text-blue-400">
                  {sorted[0].data.header.fullName || 'Untitled Resume'}
                </span>
                <span className="mt-1 block truncate text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                  {sorted[0].data.header.headline || 'Resume'} · Last edited {formatDateTime(sorted[0].updatedAt)}
                </span>
              </span>
              <span className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors group-hover:text-zinc-900 sm:flex dark:text-zinc-400 dark:group-hover:text-white">
                Open <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          </section>
        )}

        {/* ─── Quick actions ────────────────────────────────────────────────── */}
        <section id="builder" aria-label="Start a resume" className="scroll-mt-28">
          <div className="grid gap-3 sm:grid-cols-3">
            <QuickAction
              icon={<Plus className="h-5 w-5" aria-hidden="true" />}
              title="New Resume"
              desc="Start from a clean professional slate"
              onClick={onCreate}
              accent="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            />
            <QuickAction
              icon={<Download className="h-5 w-5" aria-hidden="true" />}
              title="Load JSON backup"
              desc="Restore a previously exported .json"
              onClick={onImportJSON}
              accent="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
            />
            <QuickAction
              icon={<FileText className="h-5 w-5" aria-hidden="true" />}
              title="Analyze PDF"
              desc="Extract content from an existing resume"
              onClick={onImportPDF}
              accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            />
          </div>
        </section>

        {/* ─── Documents ────────────────────────────────────────────────────── */}
        <section aria-labelledby="documents-heading" className="mt-10 sm:mt-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2
              id="documents-heading"
              className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500"
            >
              Your documents
              <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {resumes.length}
              </span>
            </h2>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setSortKey(k => (k === 'updatedAt' ? 'name' : 'updatedAt'))}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-[#17171b] dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
              >
                {sortKey === 'updatedAt' ? <Clock className="h-3.5 w-3.5" aria-hidden="true" /> : <SortAsc className="h-3.5 w-3.5" aria-hidden="true" />}
                {sortKey === 'updatedAt' ? 'Last updated' : 'Name'}
              </button>

              <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-[#17171b]">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`rounded-md p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
                >
                  <Grid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`rounded-md p-1.5 transition-colors ${viewMode === 'list' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {sorted.length === 0 && !hasResumes ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-800">
              <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <FileText className="h-8 w-8 text-zinc-400 dark:text-zinc-600" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-300">No resumes yet</h3>
              <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-500">
                Create your first resume — it only takes a few minutes, and it&apos;s saved automatically.
              </p>
              <button
                onClick={onCreate}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                <Plus className="h-4 w-4" aria-hidden="true" /> Create resume
              </button>
            </div>
          ) : sorted.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
              No resume matches “{search}”.
            </p>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {sorted.map(resume => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  viewMode="grid"
                  onOpen={() => onOpen(resume.id)}
                  onDelete={() => onDelete(resume.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sorted.map(resume => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  viewMode="list"
                  onOpen={() => onOpen(resume.id)}
                  onDelete={() => onDelete(resume.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ─── SEO / AEO / GEO content ───────────────────────────────────────── */}
        <MarketingSections />

        {/* ─── Footer ────────────────────────────────────────────────────────── */}
        <footer className="mt-20 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">OwnResume</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
                A free, private resume builder for job seekers. Your data stays in your browser — always.
              </p>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3 sm:gap-10">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-300">
                  Product
                </h2>
                <ul className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-500">
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="#builder">Resume builder</a></li>
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="#features">Features</a></li>
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="#how-it-works">How it works</a></li>
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="#faq">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-300">
                  Guides
                </h2>
                <ul className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-500">
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="/guides/how-to-write-a-resume/">How to write a resume</a></li>
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="/guides/ats-resume/">ATS resume guide</a></li>
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="/guides/resume-format/">Resume formats</a></li>
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="/templates/">Resume templates</a></li>
                </ul>
              </div>
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-300">
                  Resources
                </h2>
                <ul className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-500">
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="/sitemap.xml">Sitemap</a></li>
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="/llms.txt">llms.txt</a></li>
                  <li><a className="transition-colors hover:text-zinc-900 dark:hover:text-white" href="/robots.txt">robots.txt</a></li>
                  <li>
                    <a
                      className="transition-colors hover:text-zinc-900 dark:hover:text-white"
                      href="https://github.com/daniyal44/Resume-Builder"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          <p className="mt-8 border-t border-zinc-200 pt-5 text-[11px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
            © {new Date().getFullYear()} OwnResume. Free to use. Built with React, TypeScript &amp; Vite.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
