import { forwardRef } from 'react';
import type { ResumeData } from '../../types/resume';

interface Props {
  data: ResumeData;
}

const ElegantMinimal = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { header, summary, experience, education, projects, skills, accentColor } = data;
  const ac = accentColor || '#3b82f6';

  return (
    <div ref={ref} className="bg-white min-h-[1131px] font-sans text-slate-900 px-12 py-10">
      <div className="max-w-[760px] mx-auto space-y-10">
        <header className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.45em] text-slate-400">{header.headline}</p>
              <h1 className="text-5xl font-black tracking-tight text-slate-900">{header.fullName || 'Your Name'}</h1>
            </div>
            <div className="rounded-full border-4 border-slate-200 p-4" style={{ borderColor: ac }}>
              {header.profilePicture ? <img src={header.profilePicture} alt={header.fullName} className="w-24 h-24 rounded-full object-cover" /> : <div className="w-24 h-24 rounded-full bg-slate-200" />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
            <div className="space-y-1"><span className="font-semibold text-slate-900">Email</span><div>{header.email}</div></div>
            <div className="space-y-1"><span className="font-semibold text-slate-900">Phone</span><div>{header.contactNumber}</div></div>
            <div className="space-y-1"><span className="font-semibold text-slate-900">Location</span><div>{header.physicalAddress}</div></div>
          </div>
        </header>

        {summary && (
          <section className="rounded-[2rem] bg-slate-50 p-8 border border-slate-200">
            <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Summary</h2>
            <p className="text-sm leading-7 text-slate-700">{summary}</p>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {experience.length > 0 && (
              <div className="rounded-[2rem] bg-slate-50 p-8 border border-slate-200">
                <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Experience</h2>
                <div className="space-y-6">
                  {experience.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between gap-3 items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                          <p className="text-sm text-slate-500">{exp.company}</p>
                        </div>
                        <span className="text-[11px] uppercase text-slate-500">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-7 whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="rounded-[2rem] bg-slate-50 p-8 border border-slate-200">
                <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Education</h2>
                <div className="space-y-5">
                  {education.map(edu => (
                    <div key={edu.id}>
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <p className="text-sm text-slate-500">{edu.school}</p>
                      <p className="text-[11px] uppercase text-slate-500 mt-2">{edu.year}{edu.gpa ? ` • GPA ${edu.gpa}` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {projects.length > 0 && (
              <div className="rounded-[2rem] bg-slate-50 p-8 border border-slate-200">
                <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Projects</h2>
                <div className="space-y-5">
                  {projects.map(project => (
                    <div key={project.id}>
                      <div className="font-bold text-slate-900">{project.name}</div>
                      <p className="text-sm text-slate-700 leading-7">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills.length > 0 && (
              <div className="rounded-[2rem] bg-slate-50 p-8 border border-slate-200">
                <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Skills</h2>
                <div className="grid grid-cols-2 gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center justify-center rounded-full bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 border border-slate-200" style={{ color: ac, borderColor: ac + '33' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
});

ElegantMinimal.displayName = 'ElegantMinimal';
export default ElegantMinimal;
