import { useState } from 'react';
import { Wrench, X } from 'lucide-react';

interface Props {
  data: string[];
  onChange: (data: string[]) => void;
}

export default function SkillsForm({ data, onChange }: Props) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmed = inputValue.trim().replace(/,$/, '');
    if (trimmed && !data.includes(trimmed)) {
      onChange([...data, trimmed]);
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="bg-white dark:bg-[#09090b] transition-colors p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Skills</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-2">Add Core Skills</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500"
              placeholder="e.g. React, TypeScript (Press Enter)"
            />
            <button
              onClick={addSkill}
              className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 text-sm font-semibold rounded-xl transition-colors shrink-0"
            >
              Add
            </button>
          </div>
        </div>

        {data.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {data.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200 shadow-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="p-1 rounded-md hover:bg-orange-200 transition-colors shrink-0 text-orange-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
