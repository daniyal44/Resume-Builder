import { Link, Plus, Trash2 } from 'lucide-react';
import type { ProfileData } from '../../types/resume';

interface Props {
  data: ProfileData[];
  onChange: (data: ProfileData[]) => void;
}

export default function ProfilesForm({ data, onChange }: Props) {
  const handleAdd = () => {
    onChange([...data, { id: crypto.randomUUID(), network: '', username: '', url: '' }]);
  };

  const handleUpdate = (id: string, field: keyof ProfileData, value: string) => {
    onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="bg-white dark:bg-[#09090b] transition-colors p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Link className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Social Profiles</h3>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Profile
        </button>
      </div>
      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <Link className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">No profiles added yet.</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="relative group bg-zinc-50 dark:bg-zinc-800/50 transition-colors border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-indigo-300 transition-colors shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5 pr-12">
              <button onClick={() => onChange(data.filter(i => i.id !== item.id))} className="absolute top-4 right-4 p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <div>
                <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Network</label>
                <input type="text" value={item.network} onChange={(e) => handleUpdate(item.id, 'network', e.target.value)} className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all bg-white dark:bg-[#09090b] transition-colors" placeholder="e.g. LinkedIn" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Username</label>
                <input type="text" value={item.username} onChange={(e) => handleUpdate(item.id, 'username', e.target.value)} className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all bg-white dark:bg-[#09090b] transition-colors" placeholder="e.g. johndoe" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">URL</label>
                <input type="url" value={item.url} onChange={(e) => handleUpdate(item.id, 'url', e.target.value)} className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all bg-white dark:bg-[#09090b] transition-colors" placeholder="https://..." />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
