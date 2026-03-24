import type { ResumeData } from '../types/resume';

export interface SavedResume {
  id: string;
  name: string;
  updatedAt: string; // ISO date string
  data: ResumeData;
}

const KEY = 'resume_builder_resumes';

export function loadResumes(): SavedResume[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedResume[]) : [];
  } catch {
    return [];
  }
}

export function saveResume(resume: SavedResume): void {
  const all = loadResumes();
  const idx = all.findIndex(r => r.id === resume.id);
  if (idx >= 0) {
    all[idx] = resume;
  } else {
    all.unshift(resume);
  }
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteResume(id: string): void {
  const all = loadResumes().filter(r => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
