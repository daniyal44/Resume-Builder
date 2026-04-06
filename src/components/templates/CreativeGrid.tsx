import { forwardRef } from 'react';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import type { ResumeData } from '../../types/resume';

interface Props {
  data: ResumeData;
}

const CreativeGrid = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { header, summary, experience, education, projects, skills, certifications, languages, accentColor } = data;
  const ac = accentColor || '#3b82f6';

  return (
    <div ref={ref} className="bg-white min-h-[1131px] font-sans text-slate-900 p-10">
      <div className="grid grid-cols-12 gap-6 h-full">
        <div className="col-span-12 xl:col-span-4 bg-slate-50 rounded-[2rem] p-8 flex flex-col gap-8">
          <div className="space-y-4">
            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              {header.profilePicture ? <img src={header.profilePicture} alt={header.fullName} className="w-full h-full object-cover" /> : <div className="bg-slate-200 w-full h-full" />}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.45em] text-slate-400">About</div>
              <h1 className="text-3xl font-black text-slate-900 mt-3">{header.fullName || 'Your Name'}</h1>
              <p className="text-sm text-slate-500 mt-2 leading-6">{header.headline}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.45em] text-slate-400">Contact</h2>
            <div className="space-y-3 text-sm text-slate-700">
              {header.email && <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-slate-500" /><span>{header.email}</span></div>}
              {header.contactNumber && <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-slate-500" /><span>{header.contactNumber}</span></div>}
              {header.website && <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-slate-500" /><span>{header.website.replace(/^https?:\/\//, '')}</span></div>}
              {header.physicalAddress && <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-slate-500" /><span>{header.physicalAddress}</span></div>}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.45em] text-slate-400">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-white border border-slate-200 text-[11px] font-semibold rounded-full" style={{ borderColor: ac, color: ac }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.45em] text-slate-400">Languages</h2>
            <p className="text-sm text-slate-700">{languages || 'English'}</p>
          </div>

          {certifications && (
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.45em] text-slate-400">Certifications</h2>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{certifications}</p>
            </div>
          )}
        </div>

        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
          <div className="rounded-[2rem] bg-gradient-to-r from-white to-slate-50 border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Profile Summary</h2>
                <p className="text-sm text-slate-500 mt-2 leading-6">{summary || 'Add a professional summary to highlight your experience and goals.'}</p>
              </div>
              <div className="w-20 h-20 rounded-3xl" style={{ backgroundColor: ac }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="rounded-[2rem] bg-slate-50 border border-slate-200 p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.35em] text-slate-400 mb-4">Experience</h3>
              <div className="space-y-5">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h4 className="font-bold text-slate-900">{exp.role}</h4>
                      <span className="text-[11px] uppercase text-slate-500">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <p className="text-[13px] text-slate-700 font-semibold" style={{ color: ac }}>{exp.company}</p>
                    <p className="text-sm text-slate-600 leading-6 mt-2 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] bg-slate-50 border border-slate-200 p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.35em] text-slate-400 mb-4">Education</h3>
              <div className="space-y-5">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                      <span className="text-[11px] uppercase text-slate-500">{edu.year}</span>
                    </div>
                    <p className="text-[13px] text-slate-700 font-semibold" style={{ color: ac }}>{edu.school}</p>
                    {edu.gpa && <p className="text-sm text-slate-600 mt-2">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {projects.length > 0 && (
            <section className="rounded-[2rem] bg-slate-50 border border-slate-200 p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.35em] text-slate-400 mb-4">Projects</h3>
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center gap-3">
                      <h4 className="font-bold text-slate-900">{project.name}</h4>
                      {project.url && <span className="text-[11px] uppercase text-slate-500">Live</span>}
                    </div>
                    <p className="text-sm text-slate-600 leading-6">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

CreativeGrid.displayName = 'CreativeGrid';
export default CreativeGrid;
