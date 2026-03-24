import { forwardRef } from 'react';
import { Mail, Phone, Globe, MapPin, Linkedin, Github, Twitter } from 'lucide-react';
import type { ResumeData } from '../../types/resume';

interface Props {
  data: ResumeData;
}

const ModernSidebar = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { header, profiles, summary, experience, projects, education, skills, languages, accentColor } = data;
  const ac = accentColor || '#3b82f6'; // Default blue

  const IconMap: any = {
    'LinkedIn': <Linkedin className="w-3 h-3" />,
    'GitHub': <Github className="w-3 h-3" />,
    'Twitter': <Twitter className="w-3 h-3" />,
  };

  return (
    <div ref={ref} className="bg-white w-full min-h-[1131px] font-sans text-slate-800 flex print:shadow-none">
      {/* Sidebar */}
      <aside className="w-[280px] bg-slate-50 border-r border-slate-200 p-8 flex flex-col gap-8 shrink-0">
        {/* Profile Pic */}
        {header.profilePicture && (
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-md mx-auto">
            <img src={header.profilePicture} alt={header.fullName} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Contact info */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Contact</h3>
          <div className="space-y-3 text-[12px]">
            {header.email && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100" style={{ color: ac }}>
                  <Mail className="w-3 h-3" />
                </div>
                <span className="truncate">{header.email}</span>
              </div>
            )}
            {header.contactNumber && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100" style={{ color: ac }}>
                  <Phone className="w-3 h-3" />
                </div>
                <span>{header.contactNumber}</span>
              </div>
            )}
            {header.website && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100" style={{ color: ac }}>
                  <Globe className="w-3 h-3" />
                </div>
                <span className="truncate">{header.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            {header.physicalAddress && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100" style={{ color: ac }}>
                  <MapPin className="w-3 h-3" />
                </div>
                <span>{header.physicalAddress}</span>
              </div>
            )}
          </div>
        </section>

        {/* Socials */}
        {profiles.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Social</h3>
            <div className="space-y-3 text-[12px]">
              {profiles.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100" style={{ color: ac }}>
                    {IconMap[p.network] || <Globe className="w-3 h-3" />}
                  </div>
                  <span className="font-semibold">{p.network}:</span>
                  <span className="truncate">{p.username}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Skills</h3>
            <div className="space-y-2.5">
              {skills.map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span>{s}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '85%', backgroundColor: ac }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Languages</h3>
            <p className="text-[12px] whitespace-pre-wrap">{languages}</p>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 border-l-4 pl-4" style={{ borderColor: ac }}>
            {header.fullName || 'Your Name'}
          </h1>
          {header.headline && (
            <p className="text-lg font-bold text-slate-500 mt-2 pl-4 uppercase tracking-[0.2em]">{header.headline}</p>
          )}
        </div>

        {summary && (
          <section className="space-y-3">
            <h2 className="text-[13px] font-black uppercase tracking-widest flex items-center gap-3" style={{ color: ac }}>
              <span className="w-8 h-[2px]" style={{ backgroundColor: ac }} /> Summary
            </h2>
            <p className="text-[13px] leading-relaxed text-justify text-slate-700">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-[13px] font-black uppercase tracking-widest flex items-center gap-3" style={{ color: ac }}>
              <span className="w-8 h-[2px]" style={{ backgroundColor: ac }} /> Experience
            </h2>
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-6 border-l border-slate-100">
                  <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full border-2 border-white" style={{ backgroundColor: ac }} />
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[14px] font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-[12px] font-bold mb-2 uppercase tracking-wide" style={{ color: ac }}>{exp.company}</p>
                  <p className="text-[12.5px] leading-relaxed whitespace-pre-wrap text-slate-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-[13px] font-black uppercase tracking-widest flex items-center gap-3" style={{ color: ac }}>
              <span className="w-8 h-[2px]" style={{ backgroundColor: ac }} /> Education
            </h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900">{edu.degree}</h3>
                    <p className="text-[12px] font-bold" style={{ color: ac }}>{edu.school}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">{edu.year}</p>
                    {edu.gpa && <p className="text-[11px] font-bold text-slate-500">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="space-y-4">
             <h2 className="text-[13px] font-black uppercase tracking-widest flex items-center gap-3" style={{ color: ac }}>
              <span className="w-8 h-[2px]" style={{ backgroundColor: ac }} /> Projects
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {projects.map(proj => (
                <div key={proj.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-[13px] font-bold text-slate-900">{proj.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{proj.startDate} – {proj.endDate}</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed mb-1">{proj.description}</p>
                  {proj.url && <a href={proj.url} className="text-[10px] font-bold hover:underline" style={{ color: ac }}>View Project →</a>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
});

ModernSidebar.displayName = 'ModernSidebar';
export default ModernSidebar;
