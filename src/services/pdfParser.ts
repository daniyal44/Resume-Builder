import type { ResumeData } from '../types/resume';
import { generateId } from './storage';

const defaultResume: ResumeData = {
  header: {
    profilePicture: '',
    fullName: '',
    headline: '',
    email: '',
    website: '',
    contactNumber: '',
    physicalAddress: '',
  },
  profiles: [],
  education: [],
  experience: [],
  projects: [],
  skills: [],
  interests: [],
  summary: '',
  certifications: '',
  languages: '',
  templateId: 'modern-sidebar',
  accentColor: '#3b82f6',
};

const normalizeLine = (line: string) =>
  line
    .replace(/\u00A0/g, ' ')
    .replace(/[–—‒]/g, '-')
    .replace(/[\s]+/g, ' ')
    .trim();

const splitTextLines = (text: string) =>
  text
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter((line) => line.length > 0);

const isContactLine = (line: string) =>
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(line)
  || /(\+?\d[\d()\s.\-]{7,})/.test(line)
  || /https?:\/\/[^\s]+/i.test(line)
  || /\b(linkedin|github|portfolio|website|web|www)\b/i.test(line);

const extractEmail = (text: string) => {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : '';
};

const normalizePhone = (raw: string) =>
  raw
    .replace(/[()\s.-]/g, '')
    .replace(/^\+?1?/, '+1')
    .replace(/^\+0+/, '+0');

const extractPhone = (text: string) => {
  const match = text.match(/(\+?\d[\d()\s.\-]{7,}\d)/);
  return match ? normalizePhone(match[0]) : '';
};

const extractWebsite = (text: string) => {
  const match = text.match(/https?:\/\/[^\s,;]+/i);
  if (match) return match[0];
  const wwwMatch = text.match(/\bwww\.[^\s,;]+/i);
  return wwwMatch ? `https://${wwwMatch[0]}` : '';
};

const extractAddress = (lines: string[]) => {
  const addressRegex = /\b(Street|St\.?|Avenue|Ave\.?|Boulevard|Blvd\.?|Road|Rd\.?|Lane|Ln\.?|Drive|Dr\.?|Suite|Ste\.?|Apartment|Apt\.?|Zip|Postal)\b/i;
  for (const line of lines) {
    if (addressRegex.test(line) && !isContactLine(line)) {
      return line;
    }
  }
  return '';
};

const isNameCandidate = (value: string) => {
  const candidate = value.replace(/[|•·•]/g, ' ').trim();
  if (!candidate || /\b(resume|cv|email|phone|address|website|linkedin|github|summary|skills|education|experience|projects|languages|certifications|portfolio)\b/i.test(candidate)) {
    return false;
  }

  const words = candidate.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 5) return false;

  const validWord = (word: string) =>
    /^[A-Z][a-zA-Z'`.-]{1,}$/.test(word) || /^[A-Z]{2,}$/.test(word);

  return words.every(validWord);
};

const extractName = (lines: string[]) => {
  for (const line of lines.slice(0, 12)) {
    if (isContactLine(line)) continue;
    const cleaned = line.replace(/^Resume[:\s]*$/i, '').replace(/^CV[:\s]*$/i, '').trim();
    if (!cleaned) continue;
    if (isNameCandidate(cleaned)) return cleaned;
    if (cleaned.includes('|') || cleaned.includes('-')) {
      const parts = cleaned.split(/[|\-]/).map((part) => part.trim());
      const match = parts.find(isNameCandidate);
      if (match) return match;
    }
  }
  return '';
};

const SECTION_HEADER_PATTERNS: Record<string, RegExp> = {
  summary: /^(SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE|ABOUT ME|ABOUT)$/i,
  experience: /^(EXPERIENCE|WORK HISTORY|EMPLOYMENT|PROFESSIONAL EXPERIENCE|CAREER HISTORY)$/i,
  education: /^(EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS|ACADEMIC HISTORY)$/i,
  skills: /^(SKILLS|TECHNICAL SKILLS|COMPETENCIES|EXPERTISE|TOOLS|TECHNOLOGIES)$/i,
  projects: /^(PROJECTS|PERSONAL PROJECTS|KEY PROJECTS|PROJECT EXPERIENCE)$/i,
  certifications: /^(CERTIFICATIONS|CERTIFICATES|LICENSES)$/i,
  languages: /^(LANGUAGES|LANGUAGE PROFICIENCY)$/i,
};

const getSectionKey = (line: string) => {
  const normalized = line.replace(/[^A-Za-z0-9 ]+/g, ' ').trim();
  for (const [key, pattern] of Object.entries(SECTION_HEADER_PATTERNS)) {
    if (pattern.test(normalized)) return key;
  }
  return '';
};

const splitBlocks = (lines: string[]) => {
  const blocks: string[][] = [];
  let block: string[] = [];
  for (const line of lines) {
    if (!line.trim()) {
      if (block.length) {
        blocks.push(block);
        block = [];
      }
      continue;
    }
    if (/^[•·\-*]+\s*/.test(line)) {
      const cleaned = line.replace(/^[•·\-*]+\s*/, '').trim();
      if (cleaned) block.push(cleaned);
      continue;
    }
    if (block.length && /^(?:[A-Z][A-Z\s]+)$/.test(line) && line.length < 40) {
      blocks.push(block);
      block = [];
    }
    block.push(line);
  }
  if (block.length) blocks.push(block);
  return blocks;
};

const parseEntryBlock = (lines: string[], defaultSubtitle: string) => {
  if (!lines.length) return null;
  const firstLine = lines[0];
  const secondLine = lines.length > 1 ? lines[1] : '';

  const roleOrDegree = secondLine || defaultSubtitle;
  const description = lines.slice(2).join('\n').trim() || lines.slice(1).join('\n').trim();

  return {
    title: firstLine,
    subtitle: roleOrDegree,
    description,
  };
};

const parseExperienceBlocks = (lines: string[]) =>
  splitBlocks(lines)
    .map((block) => {
      const parsed = parseEntryBlock(block, 'Imported Role');
      if (!parsed) return null;
      return {
        id: generateId(),
        company: parsed.title,
        role: parsed.subtitle,
        startDate: '',
        endDate: '',
        description: parsed.description,
      };
    })
    .filter(Boolean) as ResumeData['experience'];

const parseEducationBlocks = (lines: string[]) =>
  splitBlocks(lines)
    .map((block) => {
      const parsed = parseEntryBlock(block, 'Imported Degree');
      if (!parsed) return null;
      return {
        id: generateId(),
        school: parsed.title,
        degree: parsed.subtitle,
        year: '',
        gpa: '',
      };
    })
    .filter(Boolean) as ResumeData['education'];

const parseProjectBlocks = (lines: string[]) =>
  splitBlocks(lines)
    .map((block) => {
      const parsed = parseEntryBlock(block, '');
      if (!parsed) return null;
      return {
        id: generateId(),
        name: parsed.title,
        description: parsed.description,
        url: extractWebsite(block.join(' ')) || '',
        startDate: '',
        endDate: '',
      };
    })
    .filter(Boolean) as ResumeData['projects'];

const parseSkills = (skillLines: string[], otherLines: string[]) => {
  const raw = skillLines.length
    ? skillLines.join(' ')
    : otherLines.filter((line) => /[,;•·]|\b(JavaScript|TypeScript|Python|React|Node\.js|SQL|AWS|Docker|Kubernetes|Git|HTML|CSS)\b/i.test(line)).join(' ');

  const normalized = raw
    .replace(/[•·]/g, ',')
    .replace(/\band\b/gi, ',')
    .replace(/[^\w\s,./#+-]/g, ' ');

  return Array.from(
    new Set(
      normalized
        .split(/[,;\/]+/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 1)
    )
  ).slice(0, 50);
};

const extractLanguageString = (lines: string[]) => {
  for (const candidate of lines) {
    if (/^(LANGUAGES|LANGUAGE PROFICIENCY)[:\s]/i.test(candidate)) {
      return candidate.replace(/^(LANGUAGES|LANGUAGE PROFICIENCY)[:\s]+/i, '');
    }
  }
  for (const candidate of lines) {
    if (/\b(English|Spanish|French|German|Mandarin|Japanese|Portuguese|Arabic|Russian)\b/i.test(candidate)) {
      return candidate;
    }
  }
  return '';
};

export const parsePdfResumeText = (fullText: string): ResumeData => {
  const lines = splitTextLines(fullText);
  const topLines = lines.slice(0, 12);
  const extractedEmail = extractEmail(fullText);
  const extractedPhone = extractPhone(fullText);
  const extractedWebsite = extractWebsite(fullText);
  const extractedAddress = extractAddress(lines);
  const extractedName = extractName(topLines) || 'Imported Resume';

  const explicit: Record<string, string> = {};
  const sectionCollections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    other: [],
  };

  let currentSection = 'other';

  for (const rawLine of lines) {
    const line = rawLine.replace(/^[•·\-*]+\s*/, '').trim();
    const sectionKey = getSectionKey(line);
    if (sectionKey) {
      currentSection = sectionKey;
      continue;
    }

    const fieldMatch = line.match(/^(name|full name|headline|title|email|website|url|phone|mobile|contact|address|location|summary|certifications|languages|skills|education|experience|projects|objective|profile)\s*[:\-–]\s*(.+)$/i);
    if (fieldMatch) {
      const key = fieldMatch[1].toLowerCase();
      const value = fieldMatch[2].trim();
      explicit[key] = value;
      continue;
    }

    if (isContactLine(line)) {
      if (!explicit.email && extractedEmail && line.includes('@')) {
        explicit.email = extractedEmail;
        continue;
      }
      if (!explicit.contact && extractedPhone && /\d/.test(line)) {
        explicit.contact = extractedPhone;
        continue;
      }
      if (!explicit.website && /https?:\/\//i.test(line)) {
        explicit.website = extractedWebsite;
        continue;
      }
    }

    if (currentSection in sectionCollections) {
      sectionCollections[currentSection].push(line);
    } else {
      sectionCollections.other.push(line);
    }
  }

  const summaryLines = sectionCollections.summary.length
    ? sectionCollections.summary
    : sectionCollections.other.slice(0, 3);

  const skills = parseSkills(sectionCollections.skills, sectionCollections.other);

  const summary = summaryLines.join(' ').trim();
  const certifications = explicit.certifications || sectionCollections.certifications.join(' ');
  const languages = explicit.languages || extractLanguageString(sectionCollections.languages.concat(sectionCollections.other));

  return {
    ...defaultResume,
    header: {
      ...defaultResume.header,
      profilePicture: '',
      fullName: explicit['name'] || explicit['full name'] || extractedName,
      headline: explicit.headline || explicit.title || '',
      email: explicit.email || extractedEmail,
      website: explicit.website || extractedWebsite,
      contactNumber: explicit.contact || extractedPhone,
      physicalAddress: explicit.address || explicit.location || extractedAddress,
    },
    summary: summary.slice(0, 2000),
    skills,
    experience: parseExperienceBlocks(sectionCollections.experience),
    education: parseEducationBlocks(sectionCollections.education),
    projects: parseProjectBlocks(sectionCollections.projects),
    certifications: certifications.trim(),
    languages: languages.trim(),
  };
};

const gatherTextItems = (content: any) => {
  const items = (content.items as any[])
    .map((item) => ({
      text: typeof item.str === 'string' ? item.str : typeof item.unicode === 'string' ? item.unicode : '',
      x: item.transform?.[4] ?? 0,
      y: item.transform?.[5] ?? 0,
    }))
    .filter((item) => item.text.trim().length > 0);

  items.sort((a, b) => {
    if (Math.abs(a.y - b.y) > 3) return b.y - a.y;
    return a.x - b.x;
  });

  const lines: { y: number; text: string }[] = [];
  for (const item of items) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.y - item.y) < 4) {
      last.text += ` ${item.text}`;
    } else {
      lines.push({ y: item.y, text: item.text });
    }
  }

  return lines.map((line) => normalizeLine(line.text)).join('\n');
};

export const extractPdfText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
  const pdfWorker = await import('pdfjs-dist/legacy/build/pdf.worker.min.js?url');
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker.default;

  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const content = await page.getTextContent();
    pages.push(gatherTextItems(content));
  }

  const fullText = pages.filter(Boolean).join('\n').trim();
  if (!fullText) {
    throw new Error('No text content found in the PDF. It might be an image-only document.');
  }
  return fullText;
};
