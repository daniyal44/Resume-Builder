import { forwardRef } from 'react';
import type { ResumeData } from '../../types/resume';

interface Props {
  data: ResumeData;
}

const ProfessionalSplit = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { header, summary, experience, education, projects, skills, interests, accentColor } = data;
  const ac = accentColor || '#3b82f6';

  return (
    <div ref={ref} className="bg-white min-h-[1131px] font-sans text-slate-900">
      <div className="grid grid-cols-12 gap-8 p-10">
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full uppercase tracking-[0.35em] text-[11px] font-black" style={{ backgroundColor: ac, color: '#fff' }}>
              Professional Resume
            </div>
            <h1 className="text-5xl font-black tracking-tight">{header.fullName || 'Your Name'}</h1>
            <p className="text-lg text-slate-600 max-w-2xl">{header.headline}</p>
          </header>

          {summary && (
            <section className="rounded-[1.75rem] bg-slate-50 p-8 border border-slate-200">
              <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Profile</h2>
              <p className="text-sm leading-7 text-slate-700">{summary}</p>
            </section>
          )}

          <section className="grid grid-cols-1 gap-6">
            {experience.length > 0 && (
              <div className="rounded-[1.75rem] bg-slate-50 p-8 border border-slate-200">
                <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Experience</h2>
                <div className="space-y-6">
                  {experience.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start gap-4 mb-2">
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
              <div className="rounded-[1.75rem] bg-slate-50 p-8 border border-slate-200">
                <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Education</h2>
                <div className="space-y-4">
                  {education.map(edu => (
                    <div key={edu.id} className="flex justify-between gap-4 text-sm leading-6">
                      <div>
                        <div className="font-bold text-slate-900">{edu.degree}</div>
                        <div className="text-slate-500">{edu.school}</div>
                      </div>
                      <div className="text-right text-slate-500">
                        <div>{edu.year}</div>
                        {edu.gpa && <div>GPA {edu.gpa}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-[1.75rem] bg-slate-50 p-8 border border-slate-200">
            <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Contact</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {header.email && <li><strong className="text-slate-900">Email:</strong> {header.email}</li>}
              {header.contactNumber && <li><strong className="text-slate-900">Phone:</strong> {header.contactNumber}</li>}
              {header.website && <li><strong className="text-slate-900">Website:</strong> {header.website.replace(/^https?:\/\//, '')}</li>}
              {header.physicalAddress && <li><strong className="text-slate-900">Location:</strong> {header.physicalAddress}</li>}
            </ul>
          </div>

          {skills.length > 0 && (
            <div className="rounded-[1.75rem] bg-slate-50 p-8 border border-slate-200">
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

          {projects.length > 0 && (
            <div className="rounded-[1.75rem] bg-slate-50 p-8 border border-slate-200">
              <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Projects</h2>
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id}>
                    <div className="font-bold text-slate-900">{project.name}</div>
                    <p className="text-sm text-slate-700 leading-6">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {interests.length > 0 && (
            <div className="rounded-[1.75rem] bg-slate-50 p-8 border border-slate-200">
              <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">Interests</h2>
              <p className="text-sm text-slate-700 leading-6">{interests.join(', ')}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
});

ProfessionalSplit.displayName = 'ProfessionalSplit';
export default ProfessionalSplit;
