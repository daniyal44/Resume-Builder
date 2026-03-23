import { FileText } from 'lucide-react';

interface Props {
  summary: string;
  certifications: string;
  languages: string;
  onChange: (field: string, value: string) => void;
}

export default function AdditionalInfoForm({ summary, certifications, languages, onChange }: Props) {
  return (
    <div className="bg-white dark:bg-[#09090b] transition-colors p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <FileText className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Additional Information</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1.5">Professional Summary</label>
          <textarea
            value={summary}
            onChange={(e) => onChange('summary', e.target.value)}
            rows={4}
            className="block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500 resize-none"
            placeholder="Write a brief summary of your professional background and goals..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1.5">Certifications</label>
            <textarea
              value={certifications}
              onChange={(e) => onChange('certifications', e.target.value)}
              rows={3}
              className="block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500 resize-none"
              placeholder="e.g. AWS Certified Solutions Architect"
            />
          </div>
          <div>
            <label className="block text-sm font-bold tracking-wide text-zinc-900 dark:text-zinc-100 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1.5">Languages</label>
            <textarea
              value={languages}
              onChange={(e) => onChange('languages', e.target.value)}
              rows={3}
              className="block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700/80 rounded-xl focus:ring-2 focus:ring-zinc-900/5 dark:ring-zinc-100/10 focus:border-zinc-500 dark:border-zinc-500 text-sm outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-500 resize-none"
              placeholder="e.g. English (Native), Spanish (Fluent)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
