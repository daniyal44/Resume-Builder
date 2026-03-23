import { Briefcase, Plus, Trash2 } from 'lucide-react';
import type { ExperienceData } from '../../types/resume';

interface Props {
  data: ExperienceData[];
  onChange: (data: ExperienceData[]) => void;
}

export default function ExperienceForm({ data, onChange }: Props) {
  const handleAdd = () => {
    const newItem: ExperienceData = {
      id: crypto.randomUUID(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange([...data, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ExperienceData, value: string) => {
    onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemove = (id: string) => {
    onChange(data.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white dark:bg-[#09090b] transition-colors p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Work Experience</h3>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <Briefcase className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">No work experience entries added yet.</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="relative group bg-zinc-50 dark:bg-zinc-800/50 transition-colors border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:border-zinc-700 transition-colors shadow-sm">
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-4 right-4 p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pr-10 border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Job Title / Role</label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => handleUpdate(item.id, 'role', e.target.value)}
                    className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-500"
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => handleUpdate(item.id, 'company', e.target.value)}
                    className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-500"
                    placeholder="e.g. Google"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Start Date</label>
                    <input
                      type="text"
                      value={item.startDate}
                      onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                      className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-500"
                      placeholder="e.g. Jan 2021"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">End Date</label>
                    <input
                      type="text"
                      value={item.endDate}
                      onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                      className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-500"
                      placeholder="e.g. Present"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Description / Achievements</label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                  rows={4}
                  className="block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-500 resize-none"
                  placeholder={`Suggestion: Use bullet points (•) and action verbs.\n• Led a team of 4 to develop a new feature...\n• Reduced server costs by 20% by...`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
