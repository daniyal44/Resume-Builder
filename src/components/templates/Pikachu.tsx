import { forwardRef } from 'react';
import { Mail, Phone, Globe, MapPin, Linkedin, Github, Twitter, Award, GraduationCap, Briefcase, Code } from 'lucide-react';
import type { ResumeData } from '../../types/resume';

interface Props {
  data: ResumeData;
}

const Pikachu = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { header, profiles, summary, experience, projects, education, skills, certifications, languages, accentColor } = data;
  const ac = accentColor || '#ec4899'; // Default pinkish/yellow theme often has bold colors

  const IconMap: any = {
    'LinkedIn': <Linkedin className="w-3.5 h-3.5" />,
    'GitHub': <Github className="w-3.5 h-3.5" />,
    'Twitter': <Twitter className="w-3.5 h-3.5" />,
  };

  const SectionHeader = ({ icon: Icon, title, dark = false }: { icon: any, title: string, dark?: boolean }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'}`} style={!dark ? { color: ac } : {}}>
        <Icon className="w-4 h-4" />
      </div>
      <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
    </div>
  );

  return (
    <div ref={ref} className="bg-white w-full min-h-[1131px] font-sans text-slate-800 flex print:shadow-none">
      {/* Main Content (Left) */}
      <main className="flex-1 p-12 flex flex-col gap-10">
        <header className="space-y-3">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 border-b-8 pb-3 w-fit" style={{ borderColor: ac }}>
            {header.fullName || 'Your Name'}
          </h1>
          {header.headline && (
            <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.25em]">{header.headline}</p>
          )}
        </header>

        {summary && (
          <section>
            <SectionHeader icon={Briefcase} title="Profile" />
            <p className="text-[14px] leading-relaxed text-slate-600 font-medium pl-11">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <SectionHeader icon={Briefcase} title="Experience" />
            <div className="space-y-8 pl-11">
              {experience.map(exp => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[15px] font-black text-slate-900 uppercase">{exp.role}</h3>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-[13px] font-bold" style={{ color: ac }}>{exp.company}</p>
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-slate-500 font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionHeader icon={Code} title="Projects" />
            <div className="space-y-6 pl-11">
              {projects.map(proj => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[14px] font-black text-slate-900 underline decoration-2 underline-offset-4" style={{ textDecorationColor: ac }}>{proj.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{proj.startDate} – {proj.endDate}</span>
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sidebar (Right - Dark) */}
      <aside className="w-[300px] bg-slate-900 text-white p-8 flex flex-col gap-10 shrink-0">
        {header.profilePicture && (
          <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 shadow-xl mx-auto rotate-3">
             <img src={header.profilePicture} alt={header.fullName} className="w-full h-full object-cover -rotate-3 scale-110" />
          </div>
        )}

        <section className="space-y-6">
          <SectionHeader icon={Mail} title="Contact" dark />
          <div className="space-y-4 text-[12px] pl-2 font-medium">
            {header.email && <div className="flex items-center gap-3 text-slate-300"><Mail className="w-4 h-4" /> {header.email}</div>}
            {header.contactNumber && <div className="flex items-center gap-3 text-slate-300"><Phone className="w-4 h-4" /> {header.contactNumber}</div>}
            {header.website && <div className="flex items-center gap-3 text-slate-300"><Globe className="w-4 h-4" /> {header.website.replace(/^https?:\/\//, '')}</div>}
            {header.physicalAddress && <div className="flex items-center gap-3 text-slate-300"><MapPin className="w-4 h-4" /> {header.physicalAddress}</div>}
          </div>
        </section>

        {profiles.length > 0 && (
          <section className="space-y-6">
            <SectionHeader icon={Linkedin} title="Social" dark />
            <div className="space-y-3 text-[12px] pl-2 font-medium">
              {profiles.map(p => (
                <div key={p.id} className="flex items-center gap-3 text-slate-300">
                  <div className="w-4 h-4 flex items-center justify-center" style={{ color: ac }}>
                    {IconMap[p.network] || <Globe className="w-4 h-4" />}
                  </div>
                  <span>{p.network}:</span>
                  <span className="truncate">{p.username}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="space-y-6">
            <SectionHeader icon={Code} title="Skills" dark />
            <div className="flex flex-wrap gap-2 pl-2">
              {skills.map((s, i) => (
                <span key={i} className="text-[11px] font-black uppercase px-2 py-1 rounded bg-white/10 text-white/80 border border-white/10">{s}</span>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="space-y-6">
            <SectionHeader icon={GraduationCap} title="Education" dark />
            <div className="space-y-5 pl-2">
              {education.map(edu => (
                <div key={edu.id} className="space-y-1">
                  <h3 className="text-[13px] font-black text-white leading-tight uppercase">{edu.degree}</h3>
                  <p className="text-[12px] font-bold text-slate-400">{edu.school}</p>
                  <p className="text-[11px] font-bold uppercase" style={{ color: ac }}>{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(certifications || languages) && (
          <section className="space-y-6">
            <SectionHeader icon={Award} title="More" dark />
            <div className="space-y-4 pl-2 text-[12px] font-medium text-slate-300">
               {certifications && <p className="whitespace-pre-wrap">{certifications}</p>}
               {languages && <p className="font-bold border-t border-white/10 pt-4" style={{ color: ac }}>{languages}</p>}
            </div>
          </section>
        )}
      </aside>
    </div>
  );
});

Pikachu.displayName = 'Pikachu';
export default Pikachu;
