import React, { useState } from 'react';
import type { ResumeData } from '../types/resume';

interface TemplateData {
  id: number;
  name: string;
  imageUrl: string;
  data: ResumeData;
}

const TEMPLATES: TemplateData[] = [
  { id: 1, name: 'David Kowalski', imageUrl: 'https://via.placeholder.com/800x1131?text=Resume+Template+1', data: {} as any },
  { id: 2, name: 'Sarah Martinez', imageUrl: 'https://via.placeholder.com/800x1131?text=Resume+Template+2', data: {} as any },
  { id: 3, name: 'John Doe', imageUrl: 'https://via.placeholder.com/800x1131?text=Resume+Template+3', data: {} as any },
  { id: 4, name: 'Marcus Chen', imageUrl: 'https://via.placeholder.com/800x1131?text=Resume+Template+4', data: {} as any },
  { id: 5, name: 'AA Template', imageUrl: 'https://via.placeholder.com/800x1131?text=Resume+Template+5', data: {} as any },
];

interface Props {
  count?: number;
  onSelect?: (data: ResumeData) => void;
}

const TemplatesList: React.FC<Props> = ({ count = 5, onSelect }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const items = TEMPLATES.slice(0, count);

  const handleUse = (template: TemplateData) => {
    setSelected(template.id);
    onSelect?.(template.data);
    document.getElementById('edit-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h3 className="text-base font-black tracking-widest uppercase text-zinc-900 dark:text-zinc-100">Template Gallery</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Use one of the new preloaded resume styles (image-based snapshots)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map(item => {
          const isActive = selected === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleUse(item)}
              className={`group text-left bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                isActive ? 'ring-4 ring-offset-2 dark:ring-offset-zinc-950 border-transparent shadow-2xl' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:scale-[1.02]'
              }`}
            >
              <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-3">
                <div className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{item.name}</div>
                {isActive && <div className="text-[11px] font-semibold text-emerald-600 mt-1">Selected</div>}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default TemplatesList;
