import React, { useState, useRef } from 'react';
import {
  FileText, Plus, Download, Grid, List, Trash2, MoreVertical,
  Search, SortAsc, Clock
} from 'lucide-react';
import type { SavedResume } from '../services/storage';
import ResumePreview from './ResumePreview';

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

const SCALE = 0.185; // thumbnail scale for 800px-wide resume

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const ResumeCard: React.FC<{
  resume: SavedResume;
  viewMode: ViewMode;
  onOpen: () => void;
  onDelete: () => void;
}> = ({ resume, viewMode, onOpen, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(v => !v);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={onOpen}
        className="flex items-center gap-4 px-5 py-3.5 bg-[#1c1c1e] hover:bg-[#2a2a2d] border border-zinc-800 rounded-xl cursor-pointer transition-colors group"
      >
        {/* Mini icon */}
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-zinc-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-zinc-100 text-sm truncate">{resume.data.header.fullName || 'Untitled'}</div>
          <div className="text-xs text-zinc-500 mt-0.5">{resume.data.header.headline || 'Resume'}</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 shrink-0">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(resume.updatedAt)}
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-[#2a2a2d] border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-700/50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
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
      className="group relative bg-[#1c1c1e] border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-zinc-600 transition-all duration-200 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-0.5"
    >
      {/* Preview Thumbnail */}
      <div className="relative overflow-hidden bg-zinc-900" style={{ height: `${1131 * SCALE}px` }}>
        <div
          style={{
            width: '800px',
            height: '1131px',
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        >
          <ResumePreview data={resume.data} scale={1} />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20">
            Open
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-4 py-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-bold text-zinc-100 text-sm truncate">
            {resume.data.header.fullName || 'Untitled Resume'}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            Last updated on {formatDate(resume.updatedAt)}
          </div>
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-10 w-40 bg-[#2a2a2d] border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-700/50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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



  return (
    <div className="min-h-screen bg-[#111113] text-zinc-100 flex flex-col font-sans">
      {/* Top Nav */}
      <nav className="sticky top-0 z-10 bg-[#111113]/90 backdrop-blur-md border-b border-zinc-800 px-6 sm:px-10 py-4 flex items-center gap-3">
        <FileText className="w-5 h-5 text-zinc-400" />
        <h1 className="text-xl font-bold tracking-tight text-zinc-50 flex-1">Resumes</h1>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resumes…"
            className="pl-8 pr-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 w-52"
          />
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors text-xs"
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀' : '🌙'}
        </button>
      </nav>

      <main className="flex-1 px-6 sm:px-10 py-8 max-w-screen-xl mx-auto w-full">

        {/* Toolbar row */}
        <div className="flex items-center gap-3 mb-6">
          {/* Sort */}
          <button
            onClick={() => setSortKey(k => k === 'updatedAt' ? 'name' : 'updatedAt')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 transition-colors"
          >
            {sortKey === 'updatedAt' ? <Clock className="w-3.5 h-3.5" /> : <SortAsc className="w-3.5 h-3.5" />}
            {sortKey === 'updatedAt' ? 'Last Updated' : 'Name'}
            <span className="text-zinc-500">▾</span>
          </button>

          <div className="flex-1" />

          {/* view toggle */}
          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'grid' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
        </div>
        
        {/* Continue Where You Left Off Section */}
        {sorted.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 px-1 text-left">Continue where you left off</h2>
            <div 
              onClick={() => onOpen(sorted[0].id)}
              className="group relative bg-gradient-to-br from-[#1c1c1e] to-[#161618] border border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-zinc-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 overflow-hidden flex items-center gap-6"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              
              <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {sorted[0].data.header.fullName || 'Untitled Resume'}
                </h3>
                <p className="text-sm text-zinc-400 mt-1 truncate">
                  {sorted[0].data.header.headline || 'Resume'} • Last edited {formatDate(sorted[0].updatedAt)}
                </p>
              </div>
              
              <div className="hidden sm:flex items-center gap-2 text-zinc-500 group-hover:text-white transition-colors text-sm font-semibold">
                Open Resume <Plus className="w-4 h-4 rotate-45" />
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch">
          <button
            onClick={onCreate}
            className="flex-1 group flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xl shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-50">New Resume</div>
              <div className="text-xs text-zinc-500 mt-1">Start from a clean professional slate</div>
            </div>
          </button>

          <button
            onClick={onImportJSON}
            className="flex-1 group flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xl shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-50">Load System JSON</div>
              <div className="text-xs text-zinc-500 mt-1">Import a previously exported .json file</div>
            </div>
          </button>

          <button
            onClick={onImportPDF}
            className="flex-1 group flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xl shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-50">Analyze PDF</div>
              <div className="text-xs text-zinc-500 mt-1">Extract and transform content from PDF</div>
            </div>
          </button>
        </div>

        {/* Saved Resumes Heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Your Documents</h2>
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800/50 mx-4" />
        </div>

        {/* Grid / List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

        {/* Empty state */}
        {resumes.length === 0 && (
          <div className="mt-24 flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
              <FileText className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-xl font-bold text-zinc-300">No resumes yet</h2>
            <p className="text-sm text-zinc-500 max-w-xs">
              Create your first resume to get started. It only takes a few minutes.
            </p>
            <button
              onClick={onCreate}
              className="mt-4 px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl text-sm font-semibold transition-colors"
            >
              Create Resume
            </button>
          </div>
        )}
      </main>


    </div>
  );
};

export default HomePage;
