import { FolderGit2, Plus, Trash2 } from 'lucide-react';
import type { ProjectData } from '../../types/resume';

interface Props {
  data: ProjectData[];
  onChange: (data: ProjectData[]) => void;
}

export default function ProjectsForm({ data, onChange }: Props) {
  const handleAdd = () => {
    onChange([...data, { id: crypto.randomUUID(), name: '', description: '', url: '', startDate: '', endDate: '' }]);
  };

  const handleUpdate = (id: string, field: keyof ProjectData, value: string) => {
    onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="bg-white dark:bg-[#09090b] transition-colors p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <FolderGit2 className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Projects</h3>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>
      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <FolderGit2 className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">No projects added yet.</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="relative group bg-zinc-50 dark:bg-zinc-800/50 transition-colors border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:border-zinc-700 transition-colors shadow-sm">
              <button onClick={() => onChange(data.filter(i => i.id !== item.id))} className="absolute top-4 right-4 p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pr-10 border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-5">
                <div>
                  <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Project Name</label>
                  <input type="text" value={item.name} onChange={(e) => handleUpdate(item.id, 'name', e.target.value)} className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none bg-white dark:bg-[#09090b] transition-colors" placeholder="e.g. E-Commerce Platform" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Project URL</label>
                  <input type="url" value={item.url} onChange={(e) => handleUpdate(item.id, 'url', e.target.value)} className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none bg-white dark:bg-[#09090b] transition-colors" placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Start Date</label>
                    <input type="text" value={item.startDate} onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)} className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none bg-white dark:bg-[#09090b] transition-colors" placeholder="e.g. Jan 2022" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">End Date</label>
                    <input type="text" value={item.endDate} onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)} className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none bg-white dark:bg-[#09090b] transition-colors" placeholder="e.g. Present" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={item.description} onChange={(e) => handleUpdate(item.id, 'description', e.target.value)} rows={3} className="block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none bg-white dark:bg-[#09090b] transition-colors resize-none" placeholder={`Suggestion: Highlight the goal and tech stack.\n• Built a full-stack e-commerce app using React and Node.js\n• Integrated Stripe payment gateway...`} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
