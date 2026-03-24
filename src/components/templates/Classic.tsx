import { forwardRef } from 'react';
import type { ResumeData } from '../../types/resume';

interface Props { data: ResumeData; }

const Classic = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { header, profiles, summary, experience, projects, education, skills, interests, certifications, languages, accentColor } = data;
  const ac = accentColor || '#1e293b';

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-5">
      <h3 style={{ color: ac, borderBottomColor: ac }} className="text-[11px] font-black tracking-[0.18em] uppercase border-b-2 pb-1 mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div ref={ref} className="bg-white w-full min-h-[1131px] font-sans text-zinc-800 p-12 flex flex-col gap-5 print:p-10">
      {/* Header */}
      <header className="text-center pb-5 border-b-2" style={{ borderColor: ac }}>
        <h1 className="text-4xl font-black tracking-tight uppercase" style={{ color: ac }}>{header.fullName || 'Your Name'}</h1>
        {header.headline && <p className="text-sm font-semibold tracking-widest mt-1 text-zinc-500 uppercase">{header.headline}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs text-zinc-600">
          {header.email && <span>✉ {header.email}</span>}
          {header.contactNumber && <span>✆ {header.contactNumber}</span>}
          {header.website && <span>⊕ {header.website.replace(/^https?:\/\//, '')}</span>}
          {header.physicalAddress && <span>⊙ {header.physicalAddress}</span>}
          {profiles?.map(p => <span key={p.id}>{p.network}: {p.username}</span>)}
        </div>
      </header>

      {summary && (
        <Section title="Professional Summary">
          <p className="text-[12.5px] leading-relaxed text-justify">{summary}</p>
        </Section>
      )}

      {experience?.length > 0 && (
        <Section title="Experience">
          {experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h4 className="text-[13px] font-bold">{exp.role}</h4>
                <span className="text-[11px] font-medium text-zinc-500">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span>
              </div>
              <p className="text-[12px] font-semibold mb-1" style={{ color: ac }}>{exp.company}</p>
              <p className="text-[12px] leading-relaxed whitespace-pre-wrap text-zinc-700">{exp.description}</p>
            </div>
          ))}
        </Section>
      )}

      {projects?.length > 0 && (
        <Section title="Projects">
          {projects.map(p => (
            <div key={p.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h4 className="text-[13px] font-bold">{p.name}</h4>
                <span className="text-[11px] text-zinc-500">{p.startDate}{p.endDate ? ` – ${p.endDate}` : ''}</span>
              </div>
              <p className="text-[12px] text-zinc-700 leading-relaxed mt-0.5">{p.description}</p>
            </div>
          ))}
        </Section>
      )}

      {education?.length > 0 && (
        <Section title="Education">
          {education.map(e => (
            <div key={e.id} className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-[13px] font-bold">{e.degree}</h4>
                <p className="text-[12px]" style={{ color: ac }}>{e.school}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-zinc-500">{e.year}</p>
                {e.gpa && <p className="text-[11px] text-zinc-500">GPA: {e.gpa}</p>}
              </div>
            </div>
          ))}
        </Section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {skills?.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: ac + '18', color: ac }}>{s}</span>
              ))}
            </div>
          </Section>
        )}
        {interests?.length > 0 && (
          <Section title="Interests">
            <p className="text-[12px] text-zinc-700">{interests.join(' · ')}</p>
          </Section>
        )}
      </div>

      {(certifications || languages) && (
        <div className="grid grid-cols-2 gap-6">
          {certifications && <Section title="Certifications"><p className="text-[12px] text-zinc-700 whitespace-pre-wrap">{certifications}</p></Section>}
          {languages && <Section title="Languages"><p className="text-[12px] text-zinc-700 whitespace-pre-wrap">{languages}</p></Section>}
        </div>
      )}
    </div>
  );
});

Classic.displayName = 'Classic';
export default Classic;
