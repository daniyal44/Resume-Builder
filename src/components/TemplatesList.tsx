import React, { useState } from 'react';
import type { ResumeData } from '../types/resume';

interface TemplateData {
  id: number;
  name: string;
  role: string;
  accentColor: string;
  templateId: string;
  data: ResumeData;
}

const TEMPLATE_STYLES = ['classic', 'modern-sidebar', 'bold-header', 'pikachu', 'minimal'];
const TEMPLATE_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#475569',
];

const makeTemplate = (
  id: number,
  name: string,
  role: string,
  color: string,
  templateId: string,
  partial: Partial<ResumeData>
): TemplateData => ({
  id,
  name,
  role,
  accentColor: color,
  templateId,
  data: {
    header: {
      profilePicture: `https://i.pravatar.cc/200?img=${id}`,
      fullName: name,
      headline: role,
      email: `${name.split(' ')[0].toLowerCase()}@email.com`,
      website: `https://${name.split(' ')[0].toLowerCase()}.dev`,
      contactNumber: `+1 (555) ${String(id).padStart(3, '0')}-${String(id * 7 % 9000 + 1000)}`,
      physicalAddress: ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Chicago, IL'][id % 5],
    },
    profiles: [
      { id: '1', network: 'LinkedIn', username: name.split(' ').join('').toLowerCase(), url: '' },
      { id: '2', network: 'GitHub', username: name.split(' ')[0].toLowerCase(), url: '' },
    ],
    education: [{ id: '1', degree: 'B.S. Computer Science', school: 'State University', year: String(2015 + (id % 8)), gpa: (3.5 + (id % 5) * 0.1).toFixed(1) }],
    experience: [
      {
        id: '1',
        company: `Company ${id}`,
        role: role,
        startDate: 'Jan 2020',
        endDate: 'Present',
        description: `• Led cross-functional initiatives to deliver impactful ${role.toLowerCase()} solutions.\n• Improved team productivity by implementing modern workflows.\n• Collaborated with stakeholders to align product direction with business goals.`,
      },
    ],
    projects: [{ id: '1', name: `${role} Portfolio Project`, description: `A showcase project demonstrating advanced ${role} skills.`, url: '', startDate: '2022', endDate: '2023' }],
    skills: ['Communication', 'Problem Solving', 'Teamwork', ...((partial.skills) || [])],
    interests: ['Technology', 'Reading', 'Travel'],
    summary: `Experienced ${role} with a strong track record of delivering high-impact results. Passionate about continuous learning and innovation.`,
    certifications: '',
    languages: 'English (Native)',
    templateId,
    accentColor: color,
    ...partial,
  },
});

const TEMPLATES: TemplateData[] = [
  makeTemplate(1, 'Alex Johnson', 'Software Engineer', TEMPLATE_COLORS[0], 'modern-sidebar', { skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL'] }),
  makeTemplate(2, 'Maria Garcia', 'UX Designer', TEMPLATE_COLORS[1], 'bold-header', { skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'CSS'] }),
  makeTemplate(3, 'James Wilson', 'Data Scientist', TEMPLATE_COLORS[2], 'pikachu', { skills: ['Python', 'TensorFlow', 'SQL', 'R', 'Tableau'] }),
  makeTemplate(4, 'Priya Patel', 'Product Manager', TEMPLATE_COLORS[3], 'minimal', { skills: ['Roadmapping', 'Agile', 'Jira', 'A/B Testing', 'Analytics'] }),
  makeTemplate(5, 'David Kim', 'DevOps Engineer', TEMPLATE_COLORS[4], 'classic', { skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'] }),
  // Fill the rest with cycling themes
  ...Array.from({ length: 45 }).map((_, i) => {
    const id = i + 6;
    const names = ['Sophie', 'Michael', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Isabella', 'Mason'];
    const roles = ['Marketer', 'Developer', 'Designer', 'Architect', 'Recruiter', 'Analyst', 'Writer', 'Manager', 'Scientist', 'Consultant'];
    return makeTemplate(
      id,
      `${names[i % 10]} ${i}`,
      roles[i % 10],
      TEMPLATE_COLORS[i % 10],
      TEMPLATE_STYLES[i % 5],
      { skills: ['Strategy', 'Leadership', 'Execution'] }
    );
  })
];

interface Props {
  count?: number;
  onSelect?: (data: ResumeData) => void;
}

const TemplatesList: React.FC<Props> = ({ count = 50, onSelect }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const items = TEMPLATES.slice(0, count);

  const handleUse = (template: TemplateData) => {
    setSelected(template.id);
    onSelect?.(template.data);
    document.getElementById('edit-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-black tracking-widest uppercase text-zinc-900 dark:text-zinc-100">Gallery</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Browse 50+ templates with diverse styles and layouts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map(item => {
          const isActive = selected === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleUse(item)}
              className={`group bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'ring-4 ring-offset-2 dark:ring-offset-zinc-950 border-transparent shadow-2xl'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:scale-[1.02]'
              }`}
              style={isActive ? { borderColor: item.accentColor } : {}}
            >
              <div className="aspect-[3/4] p-3 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col gap-2 relative">
                 {/* Mini Layout Mockup */}
                 <div className="flex-1 rounded-lg bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col p-2 gap-1.5 border border-zinc-100 dark:border-zinc-800">
                    <div className="h-2 rounded-full w-3/4" style={{ backgroundColor: item.accentColor }} />
                    <div className="h-1 rounded-full w-1/2 bg-zinc-200 dark:bg-zinc-700" />
                    <div className="mt-2 space-y-1">
                       <div className="h-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                       <div className="h-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                    </div>
                    {item.templateId === 'modern-sidebar' && (
                       <div className="absolute left-0 top-0 bottom-0 w-4 bg-zinc-100 dark:bg-zinc-800 flex flex-col p-1 gap-1">
                          <div className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 mx-auto" />
                          <div className="w-2 h-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 mx-auto" />
                       </div>
                    )}
                    {item.templateId === 'pikachu' && (
                       <div className="absolute right-0 top-0 bottom-0 w-3 bg-zinc-900 flex flex-col p-1 gap-1" />
                    )}
                 </div>
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <div className="p-3">
                 <div className="text-[11px] font-black uppercase text-zinc-900 dark:text-zinc-100 truncate">{item.data.header.fullName}</div>
                 <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mt-0.5 truncate">{item.templateId.replace('-', ' ')}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TemplatesList;
