import React from 'react';
import { Layout, Palette, Check } from 'lucide-react';

interface Props {
  templateId: string;
  accentColor: string;
  onChange: (field: 'templateId' | 'accentColor', value: string) => void;
}

const TEMPLATES = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern-sidebar', name: 'Modern Sidebar' },
  { id: 'bold-header', name: 'Bold Header' },
  { id: 'pikachu', name: 'Pikachu (Right Sidebar)' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'creative-grid', name: 'Creative Grid' },
  { id: 'professional-split', name: 'Professional Split' },
  { id: 'elegant-minimal', name: 'Elegant Minimal' },
];

const COLORS = [
  '#3b82f6', '#1a1a2e', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#475569', '#000000'
];

const DesignForm: React.FC<Props> = ({ templateId, accentColor, onChange }) => {
  return (
    <section className="space-y-8 bg-zinc-50/50 dark:bg-zinc-800/30 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center text-zinc-400">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">Design & Layout</h3>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Customize your look</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Template Selector */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
            <Layout className="w-3 h-3" /> Select Layout
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => onChange('templateId', t.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-[13px] font-black uppercase tracking-wide transition-all ${
                  templateId === t.id
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-lg'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {t.name}
                {templateId === t.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
             <Palette className="w-3 h-3" /> Accent Color
          </label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => onChange('accentColor', c)}
                className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 active:scale-90 flex items-center justify-center ${
                  accentColor === c ? 'border-zinc-300 dark:border-zinc-700 shadow-md' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              >
                {accentColor === c && <Check className={`w-4 h-4 ${c === '#ffffff' ? 'text-black' : 'text-white'}`} />}
              </button>
            ))}
            <div className="relative group">
              <input 
                type="color" 
                value={accentColor}
                onChange={(e) => onChange('accentColor', e.target.value)}
                className="w-10 h-10 rounded-full border-none cursor-pointer opacity-0 absolute inset-0 z-10"
              />
              <div 
                className="w-10 h-10 rounded-full border-4 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors"
                style={!COLORS.includes(accentColor) ? { backgroundColor: accentColor, borderStyle: 'solid', borderColor: '#ccc' } : {}}
              >
                <PlusIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
  </svg>
);

export default DesignForm;
