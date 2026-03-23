import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import type { EducationData } from '../../types/resume';

interface Props {
  data: EducationData[];
  onChange: (data: EducationData[]) => void;
}

export default function EducationForm({ data, onChange }: Props) {
  const handleAdd = () => {
    const newItem: EducationData = {
      id: crypto.randomUUID(),
      degree: '',
      school: '',
      year: '',
      gpa: '',
    };
    onChange([...data, newItem]);
  };

  const handleUpdate = (id: string, field: keyof EducationData, value: string) => {
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
            <GraduationCap className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Education</h3>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <GraduationCap className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">No education entries added yet.</p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pr-10">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Degree / Program</label>
                  <input
                    type="text"
                    value={item.degree}
                    onChange={(e) => handleUpdate(item.id, 'degree', e.target.value)}
                    className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-500"
                    placeholder="e.g. Bachelor of Science in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">School / University</label>
                  <input
                    type="text"
                    value={item.school}
                    onChange={(e) => handleUpdate(item.id, 'school', e.target.value)}
                    className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-500"
                    placeholder="e.g. Massachusetts Institute of Technology"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Graduation Year</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => handleUpdate(item.id, 'year', e.target.value)}
                      className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-500"
                      placeholder="e.g. 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Score / GPA</label>
                    <input
                      type="text"
                      value={item.gpa}
                      onChange={(e) => handleUpdate(item.id, 'gpa', e.target.value)}
                      className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all bg-white dark:bg-zinc-950 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-500"
                      placeholder="e.g. 3.8/4.0"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
