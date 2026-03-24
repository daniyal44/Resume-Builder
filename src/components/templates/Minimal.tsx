import { forwardRef } from 'react';
import type { ResumeData } from '../../types/resume';

interface Props {
  data: ResumeData;
}

const Minimal = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { header, summary, experience, projects, education, skills, certifications, languages, accentColor } = data;
  const ac = accentColor || '#475569';

  const Section = ({ title, children }: { title: string, children: any }) => (
    <div className="flex gap-8 group">
      <div className="w-24 shrink-0 text-right">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] pt-1" style={{ color: ac }}>{title}</h2>
      </div>
      <div className="flex-1 border-l border-slate-100 pl-8 pb-8 group-last:pb-0">
        {children}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="bg-white w-full min-h-[1131px] font-sans text-slate-800 p-16 flex flex-col gap-8 print:shadow-none print:p-12">
      <header className="flex justify-between items-end border-b-2 pb-6 mb-4" style={{ borderColor: ac }}>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
            {header.fullName || 'Your Name'}
          </h1>
          {header.headline && (
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{header.headline}</p>
          )}
        </div>
        <div className="text-right text-[11px] font-bold text-slate-500 space-y-0.5 uppercase tracking-wide">
           {header.email && <p>{header.email}</p>}
           {header.contactNumber && <p>{header.contactNumber}</p>}
           {header.physicalAddress && <p>{header.physicalAddress}</p>}
        </div>
      </header>

      <div className="flex flex-col">
        {summary && (
          <Section title="Profile">
            <p className="text-[12px] leading-relaxed text-slate-600 font-medium">{summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[13px] font-black text-slate-900 uppercase">{exp.role}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-[11px] font-black uppercase" style={{ color: ac }}>{exp.company}</p>
                  <p className="text-[12px] leading-relaxed whitespace-pre-wrap text-slate-500 font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[12px] font-black text-slate-900 uppercase">{proj.name}</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{proj.startDate} – {proj.endDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{proj.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="space-y-0.5">
                  <h3 className="text-[12px] font-black text-slate-900 uppercase leading-tight">{edu.degree}</h3>
                  <p className="text-[11px] font-bold" style={{ color: ac }}>{edu.school}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{edu.year}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: ac }} />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{s}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {(languages || certifications) && (
          <Section title="More">
            <div className="grid grid-cols-2 gap-8 text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-wide">
               {certifications && <p className="whitespace-pre-wrap">{certifications}</p>}
               {languages && <p>{languages}</p>}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
});

Minimal.displayName = 'Minimal';
export default Minimal;
