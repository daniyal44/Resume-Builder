import fs from 'fs';
import path from 'path';

// 1. Fix Live Resume Document Section Headings explicitly
const resumePath = 'd:/Games/New folder-web/Rs B/src/components/ResumePreview.tsx';
let resumeContent = fs.readFileSync(resumePath, 'utf-8');
resumeContent = resumeContent.replaceAll(
  'text-[11px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2',
  'text-[14px] font-extrabold tracking-widest text-black uppercase border-b-[2px] border-slate-300 pb-1.5 mb-3'
);
fs.writeFileSync(resumePath, resumeContent);

// 2. Fix Form Input Labels explicitly
const dir = 'd:/Games/New folder-web/Rs B/src/components/forms';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Enhance any <label> tag explicitly
  content = content.replace(/<label(.*?)className="(.*?)"(.*?)>/g, (match, p1, className, p3) => {
    let newClass = className;
    if (newClass.includes('font-medium')) {
      newClass = newClass.replace('font-medium', 'font-bold tracking-wide text-zinc-900 dark:text-zinc-100');
    } else if (newClass.includes('font-semibold')) {
      newClass = newClass.replace('font-semibold', 'font-bold tracking-wide text-zinc-900 dark:text-zinc-100');
    } else {
      newClass += ' font-bold tracking-wide text-zinc-900 dark:text-zinc-100';
    }
    return `<label${p1}className="${newClass}"${p3}>`;
  });

  fs.writeFileSync(filePath, content);
});

console.log('Script executed: Headings and Labels perfectly bolded for high contrast.');
