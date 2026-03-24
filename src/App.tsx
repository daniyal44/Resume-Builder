import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Upload, Eye, Edit2, FileDown, Sun, Moon, FileText, Columns, ArrowLeft } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import * as pdfjsLib from 'pdfjs-dist';
import type { ResumeData } from './types/resume';
import { loadResumes, saveResume, deleteResume, generateId, type SavedResume } from './services/storage';
import PersonalInfoForm from './components/forms/PersonalInfoForm';
import ProfilesForm from './components/forms/ProfilesForm';
import EducationForm from './components/forms/EducationForm';
import ExperienceForm from './components/forms/ExperienceForm';
import ProjectsForm from './components/forms/ProjectsForm';
import SkillsForm from './components/forms/SkillsForm';
import InterestsForm from './components/forms/InterestsForm';
import AdditionalInfoForm from './components/forms/AdditionalInfoForm';
import DesignForm from './components/forms/DesignForm';
import ResumePreview from './components/ResumePreview';
import TemplatesList from './components/TemplatesList';
import HomePage from './components/HomePage';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const blankResume: ResumeData = {
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

type AppScreen = 'home' | 'editor';

function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(blankResume);
  const [resumes, setResumes] = useState<SavedResume[]>(() => loadResumes());

  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const fileInputRefJSON = useRef<HTMLInputElement>(null);
  const fileInputRefPDF = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const handleClickOutside = () => { setShowUploadMenu(false); setShowDownloadMenu(false); };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: resumeData.header.fullName
      ? `${resumeData.header.fullName.replace(/\s+/g, '_')}_Resume`
      : 'Resume',
  });

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const availableWidth = previewContainerRef.current.clientWidth;
        const scale = Math.min(availableWidth / 800, 1);
        setPreviewScale(scale);
      }
    };
    setTimeout(updateScale, 50);
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [viewMode, screen]);

  // ─── Persist current resume whenever data changes ───────────────────────────
  const persistResume = useCallback((data: ResumeData, id: string) => {
    const entry: SavedResume = {
      id,
      name: data.header.fullName || 'Untitled',
      updatedAt: new Date().toISOString(),
      data,
    };
    saveResume(entry);
    setResumes(loadResumes());
  }, []);

  const handleResumeDataChange = (data: ResumeData) => {
    setResumeData(data);
    if (activeResumeId) persistResume(data, activeResumeId);
  };

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const openNewResume = () => {
    const id = generateId();
    setActiveResumeId(id);
    setResumeData(blankResume);
    setScreen('editor');
  };

  const openResume = (id: string) => {
    const found = loadResumes().find(r => r.id === id);
    if (found) {
      setActiveResumeId(id);
      setResumeData(found.data);
      setScreen('editor');
    }
  };

  const handleDelete = (id: string) => {
    deleteResume(id);
    setResumes(loadResumes());
  };

  const goHome = () => {
    // auto-save before leaving
    if (activeResumeId) persistResume(resumeData, activeResumeId);
    setResumes(loadResumes());
    setScreen('home');
  };

  // ─── Import / Export ────────────────────────────────────────────────────────
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const a = document.createElement('a');
    a.setAttribute('href', uri);
    a.setAttribute('download', 'resume.json');
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = ev.target?.result;
        if (typeof result !== 'string') throw new Error('Invalid file content');
        
        const json = JSON.parse(result) as any;
        
        // Basic validation: must have at least a header or some recognizable ResumeData structure
        if (!json || typeof json !== 'object') throw new Error('Invalid JSON format');
        
        const header = json.header || {};
        const id = generateId();
        
        const importedData: ResumeData = {
          ...blankResume, // Start with defaults
          ...json,        // Layer on imported data
          // Ensure critical fields are properly formed even if missing in JSON
          profiles: Array.isArray(json.profiles) ? json.profiles : [],
          education: Array.isArray(json.education) ? json.education : [],
          experience: Array.isArray(json.experience) ? json.experience : [],
          projects: Array.isArray(json.projects) ? json.projects : [],
          skills: Array.isArray(json.skills) ? json.skills : [],
          interests: Array.isArray(json.interests) ? json.interests : [],
          templateId: json.templateId || 'modern-sidebar',
          accentColor: json.accentColor || '#3b82f6',
          header: {
            ...blankResume.header,
            ...header,
            headline: header.headline || '',
            website: header.website || '',
          },
        };

        setActiveResumeId(id);
        setResumeData(importedData);
        persistResume(importedData, id);
        setScreen('editor');
      } catch (err) {
        console.error('Import error:', err);
        alert('Failed to parse the JSON file. Please ensure it is a valid resume export.');
      }
    };
    reader.readAsText(file);
    // Reset the input value so the same file can be picked again
    if (fileInputRefJSON.current) fileInputRefJSON.current.value = '';
  };

  const handleImportPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => 'str' in item ? item.str : '');
        fullText += strings.join(' ') + '\n';
      }

      if (!fullText.trim()) {
        throw new Error('No text content found in the PDF. It might be an image-only document.');
      }

      // ─── ROBUST PARSER ──────────────────────────────────────────────────────
      const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      const emailMatch = fullText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
      const phoneMatch = fullText.match(/(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/);
      
      // Try to find sections
      const sections: Record<string, string[]> = {
        summary: [],
        experience: [],
        education: [],
        skills: [],
        projects: [],
        other: []
      };

      let currentSection = 'summary';
      const sectionKeywords: Record<string, RegExp> = {
        experience: /^(EXPERIENCE|WORK HISTORY|EMPLOYMENT|PROFESSIONAL EXPERIENCE)/i,
        education: /^(EDUCATION|ACADEMIC|QUALIFICATIONS)/i,
        skills: /^(SKILLS|TECHNICAL SKILLS|COMPETENCIES|EXPERTISE)/i,
        projects: /^(PROJECTS|PERSONAL PROJECTS|KEY PROJECTS)/i,
        summary: /^(SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE)/i
      };

      // Identify the name (usually first non-empty line)
      let fullName = lines[0] || '';
      
      // Sanitize Name: Skip if it looks like a file path, URL, or is too long/junk
      if (fullName.length > 60 || fullName.includes('/') || fullName.includes('\\') || fullName.includes('://') || fullName.includes('@')) {
        fullName = '';
      } else {
        // Remove common junk prefixes
        fullName = fullName.replace(/^(Resume|CV|Name|Bio|Profile)[:\-\s]*/i, '').trim();
        // Truncate to reasonable name length
        if (fullName.length > 40) fullName = fullName.substring(0, 40) + '...';
      }

      lines.forEach((line) => {
        let detected = false;
        for (const [key, regex] of Object.entries(sectionKeywords)) {
          if (regex.test(line)) {
            currentSection = key;
            detected = true;
            break;
          }
        }
        if (!detected) {
          sections[currentSection].push(line);
        }
      });

      const newData: ResumeData = {
        ...blankResume,
        header: {
          ...blankResume.header,
          fullName: fullName,
          email: emailMatch ? emailMatch[0] : '',
          contactNumber: phoneMatch ? phoneMatch[0] : '',
        },
        summary: sections.summary.join(' ').substring(0, 2000),
        skills: sections.skills.join(',').split(',').map(s => s.trim()).filter(s => s.length > 2),
        // Simple mapping for experience/education (one block per detected text)
        experience: sections.experience.length > 0 ? [{
          id: generateId(),
          company: 'Imported Experience',
          role: 'See details below',
          startDate: '',
          endDate: '',
          description: sections.experience.join('\n')
        }] : [],
        education: sections.education.length > 0 ? [{
          id: generateId(),
          school: 'Imported Education',
          degree: 'See details',
          year: '',
          gpa: ''
        }] : [],
        projects: sections.projects.length > 0 ? [{
          id: generateId(),
          name: 'Imported Projects',
          description: sections.projects.join('\n'),
          url: '',
          startDate: '',
          endDate: ''
        }] : []
      };

      const id = generateId();
      setActiveResumeId(id);
      setResumeData(newData);
      persistResume(newData, id);
      setScreen('editor');
      alert('PDF parsed! We\'ve populated sections based on keywords. Please review and refine the content.');
    } catch (err: any) {
      console.error('PDF Parse Error:', err);
      if (err.message?.includes('Missing image')) {
         alert('This PDF seems to be an image-only scan. Please use a text-based PDF for better results.');
      } else {
         alert('Failed to extract text from the PDF file. Error: ' + (err.message || 'Unknown error'));
      }
    }
    if (fileInputRefPDF.current) fileInputRefPDF.current.value = '';
  };

  // ─── ViewToggleGroup ─────────────────────────────────────────────────────────
  const ViewToggleGroup = () => (
    <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg shrink-0 border border-zinc-200 dark:border-zinc-700/50">
      <button
        onClick={() => setViewMode('edit')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'edit' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
      >
        <Edit2 className="w-3.5 h-3.5" /> Edit
      </button>
      <button
        onClick={() => setViewMode('preview')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
      >
        <Eye className="w-3.5 h-3.5" /> Preview
      </button>
      <button
        onClick={() => setViewMode('split')}
        className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'split' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
      >
        <Columns className="w-3.5 h-3.5" /> Split
      </button>
    </div>
  );

  // ─── HOME PAGE ───────────────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <>
        <input type="file" accept=".json" ref={fileInputRefJSON} onChange={handleImportJSON} className="hidden" />
        <input type="file" accept=".pdf" ref={fileInputRefPDF} onChange={handleImportPDF} className="hidden" />
        <HomePage
          resumes={resumes}
          isDarkMode={isDarkMode}
          onToggleDark={() => setIsDarkMode(d => !d)}
          onCreate={openNewResume}
          onImportJSON={() => fileInputRefJSON.current?.click()}
          onImportPDF={() => fileInputRefPDF.current?.click()}
          onOpen={openResume}
          onDelete={handleDelete}
        />
      </>
    );
  }

  // ─── EDITOR ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">

      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 z-10 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={goHome}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate max-w-[120px] sm:max-w-[300px]">
            {resumeData.header.fullName || 'New Resume'}
          </h1>
        </div>

        <div className="flex gap-2 sm:gap-3 items-center">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors mr-1 sm:mr-3"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <input type="file" accept=".json" ref={fileInputRefJSON} onChange={handleImportJSON} className="hidden" />
          <input type="file" accept=".pdf" ref={fileInputRefPDF} onChange={handleImportPDF} className="hidden" />

          {/* Upload Menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowUploadMenu(!showUploadMenu); setShowDownloadMenu(false); }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Upload
            </button>
            {showUploadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
                <button onClick={() => { fileInputRefJSON.current?.click(); setShowUploadMenu(false); }} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <FileText className="w-4 h-4 text-zinc-400" /> Import JSON
                </button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
                <button onClick={() => { fileInputRefPDF.current?.click(); setShowUploadMenu(false); }} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <FileText className="w-4 h-4 text-zinc-400" /> Import PDF
                </button>
              </div>
            )}
          </div>

          {/* Download Menu */}
          <div className="relative ml-1 sm:ml-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowDownloadMenu(!showDownloadMenu); setShowUploadMenu(false); }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Download
            </button>
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
                <button onClick={() => { handleExportJSON(); setShowDownloadMenu(false); }} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <FileText className="w-4 h-4 text-zinc-400" /> Export JSON
                </button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
                <button onClick={() => { handlePrint(); setShowDownloadMenu(false); }} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <FileDown className="w-4 h-4 text-zinc-400" /> Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Editor Layout */}
      <main className={`flex-1 flex overflow-hidden relative ${viewMode === 'split' ? 'flex-col lg:flex-row' : 'flex-col'}`}>

        {/* Edit Panel */}
        <div id="edit-panel" className={`w-full ${viewMode === 'split' ? 'lg:w-[50%] xl:w-[45%] lg:border-r border-b lg:border-b-0' : 'flex-1'} border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] overflow-y-auto transition-colors duration-200 ${viewMode === 'edit' || viewMode === 'split' ? 'block' : 'hidden'}`}>
          <div className="p-4 sm:p-6 lg:p-8 space-y-8 pb-32 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Resume Details</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Fill in your information to generate a professional resume.</p>
              </div>
              <ViewToggleGroup />
            </div>

            <div className="space-y-6">
              <DesignForm templateId={resumeData.templateId} accentColor={resumeData.accentColor} onChange={(field, value) => handleResumeDataChange({ ...resumeData, [field]: value })} />
              <PersonalInfoForm data={resumeData.header} onChange={(header) => handleResumeDataChange({ ...resumeData, header })} />
              <ProfilesForm data={resumeData.profiles || []} onChange={(profiles) => handleResumeDataChange({ ...resumeData, profiles })} />
              <AdditionalInfoForm summary={resumeData.summary} certifications={resumeData.certifications} languages={resumeData.languages} onChange={(field, value) => handleResumeDataChange({ ...resumeData, [field]: value })} />
              <ExperienceForm data={resumeData.experience} onChange={(experience) => handleResumeDataChange({ ...resumeData, experience })} />
              <ProjectsForm data={resumeData.projects || []} onChange={(projects) => handleResumeDataChange({ ...resumeData, projects })} />
              <EducationForm data={resumeData.education} onChange={(education) => handleResumeDataChange({ ...resumeData, education })} />
              <SkillsForm data={resumeData.skills} onChange={(skills) => handleResumeDataChange({ ...resumeData, skills })} />
              <InterestsForm data={resumeData.interests || []} onChange={(interests) => handleResumeDataChange({ ...resumeData, interests })} />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div id="preview-panel" className={`w-full ${viewMode === 'split' ? 'lg:w-[50%] xl:w-[55%]' : 'flex-1'} bg-zinc-100 dark:bg-zinc-950 overflow-y-auto transition-colors duration-200 ${viewMode === 'preview' || viewMode === 'split' ? 'block' : 'hidden'}`}>
          <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 lg:space-y-8 pb-32 flex flex-col" ref={previewContainerRef}>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Live Preview</h2>
              </div>
            </div>

            {/* A4 Preview */}
            <div
              style={{
                width: '100%',
                height: `${1131 * previewScale}px`,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div
                className="bg-white rounded-sm shadow-xl border border-zinc-200 dark:border-zinc-800"
                style={{
                  width: '800px',
                  height: '1131px',
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  marginLeft: `-${800 * previewScale / 2}px`,
                }}
              >
                <ResumePreview ref={printRef} data={resumeData} scale={1} />
              </div>
            </div>

            {/* Live Preview section ends here */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;



//When a user uploads a PDF to enhance their resume, analyze the document to match its headings with the current resume format and automatically populate all relevant fields, such as name, email, contact information, etc., in their appropriate positions.//
