import { forwardRef } from 'react';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import type { ResumeData } from '../../types/resume';

interface Props {
  data: ResumeData;
}

const BoldHeader = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { header, summary, experience, projects, education, skills, certifications, languages, accentColor } = data;
  const ac = accentColor || '#1e293b';

  return (
    <div ref={ref} className="bg-white w-full min-h-[1131px] font-sans text-slate-800 p-16 flex flex-col gap-10 print:shadow-none print:p-12">
      {/* Header */}
      <header className="flex flex-col items-center text-center gap-6">
        {header.profilePicture && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
            <img src={header.profilePicture} alt={header.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
            {header.fullName || 'Your Name'}
          </h1>
          {header.headline && (
            <p className="text-xl font-bold tracking-[0.3em] uppercase" style={{ color: ac }}>{header.headline}</p>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
          {header.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {header.email}</div>}
          {header.contactNumber && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {header.contactNumber}</div>}
          {header.website && <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> {header.website.replace(/^https?:\/\//, '')}</div>}
          {header.physicalAddress && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {header.physicalAddress}</div>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-4 pb-2 w-fit pr-8" style={{ color: ac, borderColor: ac }}>Summary</h2>
          <p className="text-[14px] leading-relaxed text-justify text-slate-700 font-medium">{summary}</p>
        </section>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2 space-y-10">
          {experience.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-4 pb-2 w-fit pr-8" style={{ color: ac, borderColor: ac }}>Experience</h2>
              <div className="space-y-8">
                {experience.map(exp => (
                  <div key={exp.id} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[16px] font-black text-slate-900">{exp.role}</h3>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <p className="text-[13px] font-bold uppercase tracking-widest italic" style={{ color: ac }}>{exp.company}</p>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-slate-600 font-medium">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-4 pb-2 w-fit pr-8" style={{ color: ac, borderColor: ac }}>Projects</h2>
              <div className="space-y-6">
                {projects.map(proj => (
                  <div key={proj.id} className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-[15px] font-black text-slate-900 underline decoration-2 underline-offset-4" style={{ textDecorationColor: ac }}>{proj.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{proj.startDate} – {proj.endDate}</span>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-10">
          {skills.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-4 pb-2 w-fit pr-8" style={{ color: ac, borderColor: ac }}>Skills</h2>
              <div className="flex flex-col gap-2">
                {skills.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ac }} />
                    <span className="text-[13px] font-bold text-slate-700">{s}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-4 pb-2 w-fit pr-8" style={{ color: ac, borderColor: ac }}>Education</h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id} className="space-y-1">
                    <h3 className="text-[13px] font-black text-slate-900 uppercase leading-tight">{edu.degree}</h3>
                    <p className="text-[12px] font-bold" style={{ color: ac }}>{edu.school}</p>
                    <p className="text-[11px] font-bold text-slate-400">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(languages || certifications) && (
            <div className="space-y-10">
              {languages && (
                <section className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-4 pb-2 w-fit pr-8" style={{ color: ac, borderColor: ac }}>Languages</h2>
                  <p className="text-[13px] font-bold text-slate-700 whitespace-pre-wrap">{languages}</p>
                </section>
              )}
              {certifications && (
                <section className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b-4 pb-2 w-fit pr-8" style={{ color: ac, borderColor: ac }}>Awards</h2>
                  <p className="text-[12px] font-medium text-slate-600 whitespace-pre-wrap leading-relaxed">{certifications}</p>
                </section>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
});

BoldHeader.displayName = 'BoldHeader';
export default BoldHeader;
