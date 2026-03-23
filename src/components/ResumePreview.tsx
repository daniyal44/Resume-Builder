import { forwardRef, useState, useEffect } from 'react';
import type { ResumeData } from '../types/resume';

interface Props {
  data: ResumeData;
  scale?: number;
}

const ResumePreview = forwardRef<HTMLDivElement, Props>(({ data, scale = 1 }, ref) => {
  const { header, profiles, summary, experience, projects, education, skills, interests, certifications, languages } = data;

  const [imgError, setImgError] = useState(false);
  
  useEffect(() => {
    setImgError(false);
  }, [header.profilePicture]);

  const hasContactInfo = header.email || header.contactNumber || header.website || header.physicalAddress;

  return (
    <div 
      className="bg-white w-full h-full text-slate-900 font-sans shadow-sm antialiased"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      <div ref={ref} className="w-full max-w-[800px] mx-auto min-h-[1131px] bg-white p-12 sm:p-16 print:w-[800px] print:m-0 print:shadow-none print:min-h-0 flex flex-col gap-6">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center gap-5 border-b-[2px] border-slate-900 pb-6">
          {header.profilePicture && !imgError && (
            <img 
              src={header.profilePicture} 
              alt={header.fullName} 
              onError={() => setImgError(true)}
              className="w-28 h-28 rounded-xl object-cover object-top border border-slate-200 shadow-sm"
            />
          )}
          
          <div className="space-y-1.5 w-full">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              {header.fullName || 'Your Name'}
            </h1>
            {header.headline && (
              <h2 className="text-lg font-semibold tracking-wide text-slate-600 uppercase">
                {header.headline}
              </h2>
            )}
            
            {hasContactInfo && (
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-700 mt-2">
                {header.email && <span>{header.email}</span>}
                {header.contactNumber && <><span className="text-slate-300">•</span><span>{header.contactNumber}</span></>}
                {header.website && <><span className="text-slate-300">•</span><a href={header.website} className="text-slate-900 hover:underline">{header.website.replace(/^https?:\/\//, '')}</a></>}
                {header.physicalAddress && <><span className="text-slate-300">•</span><span>{header.physicalAddress}</span></>}
              </div>
            )}

            {profiles && profiles.length > 0 && (
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-700">
                {profiles.map((profile, i) => (
                  <span key={profile.id}>
                    {i > 0 && <span className="text-slate-300 mr-3">•</span>}
                    <span className="font-bold text-slate-900">{profile.network}:</span>{' '}
                    {profile.url ? <a href={profile.url} className="hover:underline">{profile.username}</a> : profile.username}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Profile Summary */}
        {(summary || summary.trim() !== '') && (
          <section className="space-y-2">
            <h3 className="text-[14px] font-extrabold tracking-widest text-black uppercase border-b-[2px] border-slate-300 pb-1.5 mb-3">
              Professional Summary
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-[14px] font-extrabold tracking-widest text-black uppercase border-b-[2px] border-slate-300 pb-1.5 mb-3">
              Experience
            </h3>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-[15px] font-bold text-slate-900">{exp.role}</h4>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      {exp.startDate} {exp.startDate && exp.endDate ? '—' : ''} {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-indigo-700 mb-1.5">{exp.company}</div>
                  <p className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
           <section className="space-y-3">
             <h3 className="text-[14px] font-extrabold tracking-widest text-black uppercase border-b-[2px] border-slate-300 pb-1.5 mb-3">
               Projects
             </h3>
             <div className="space-y-4">
               {projects.map(proj => (
                 <div key={proj.id}>
                   <div className="flex justify-between items-baseline mb-0.5">
                     <h4 className="text-[15px] font-bold text-slate-900">
                       {proj.name}
                       {proj.url && <a href={proj.url} className="text-xs font-medium text-indigo-600 hover:underline ml-2">({proj.url.replace(/^https?:\/\//, '')})</a>}
                     </h4>
                     <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                       {proj.startDate} {proj.startDate && proj.endDate ? '—' : ''} {proj.endDate}
                     </span>
                   </div>
                   <p className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap mt-1">
                     {proj.description}
                   </p>
                 </div>
               ))}
             </div>
           </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-[14px] font-extrabold tracking-widest text-black uppercase border-b-[2px] border-slate-300 pb-1.5 mb-3">
              Education
            </h3>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900">{edu.degree}</h4>
                    <div className="text-[13px] font-semibold text-indigo-700 mt-0.5">{edu.school}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{edu.year}</div>
                    {edu.gpa && <div className="text-xs font-medium text-slate-500 mt-0.5">GPA: <span className="font-bold text-slate-700">{edu.gpa}</span></div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills && skills.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-[14px] font-extrabold tracking-widest text-black uppercase border-b-[2px] border-slate-300 pb-1.5 mb-3">
                Technical Skills
              </h3>
              <div className="text-[13px] text-slate-800 leading-relaxed font-medium">
                {skills.join(', ')}
              </div>
            </section>
          )}

          {interests && interests.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-[14px] font-extrabold tracking-widest text-black uppercase border-b-[2px] border-slate-300 pb-1.5 mb-3">
                Interests & Hobbies
              </h3>
              <div className="text-[13px] text-slate-800 leading-relaxed font-medium">
                {interests.join(', ')}
              </div>
            </section>
          )}
        </div>

        {/* Certifications & Languages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications && (
            <section className="space-y-2">
              <h3 className="text-[14px] font-extrabold tracking-widest text-black uppercase border-b-[2px] border-slate-300 pb-1.5 mb-3">
                Certifications
              </h3>
              <p className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                {certifications}
              </p>
            </section>
          )}

          {languages && (
            <section className="space-y-2">
              <h3 className="text-[14px] font-extrabold tracking-widest text-black uppercase border-b-[2px] border-slate-300 pb-1.5 mb-3">
                Languages
              </h3>
              <p className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                {languages}
              </p>
            </section>
          )}
        </div>

      </div>
    </div>
  );
});

export default ResumePreview;
