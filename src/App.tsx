import { useState, useRef, useEffect } from 'react';
import { Download, Upload, Eye, Edit2, FileDown, Sun, Moon, FileText, Columns } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import * as pdfjsLib from 'pdfjs-dist';
import type { ResumeData } from './types/resume';
import PersonalInfoForm from './components/forms/PersonalInfoForm';
import ProfilesForm from './components/forms/ProfilesForm';
import EducationForm from './components/forms/EducationForm';
import ExperienceForm from './components/forms/ExperienceForm';
import ProjectsForm from './components/forms/ProjectsForm';
import SkillsForm from './components/forms/SkillsForm';
import InterestsForm from './components/forms/InterestsForm';
import AdditionalInfoForm from './components/forms/AdditionalInfoForm';
import ResumePreview from './components/ResumePreview';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const initialData: ResumeData = {
  header: {
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    fullName: 'Sarah Jenkins',
    headline: 'Senior Brand Designer',
    email: 'hello@sarah-jenkins.design',
    website: 'https://sarah-jenkins.design',
    contactNumber: '+1 (415) 555-0198',
    physicalAddress: 'San Francisco, CA',
  },
  profiles: [
    { id: '1', network: 'LinkedIn', username: 'sarahjenkins', url: 'https://linkedin.com/in/sarahjenkins' },
    { id: '2', network: 'Dribbble', username: 'sarahjdesign', url: 'https://dribbble.com/sarahjdesign' },
  ],
  education: [
    {
      id: '1',
      degree: 'BFA in Graphic Design',
      school: 'Rhode Island School of Design',
      year: '2016',
      gpa: '3.9',
    },
  ],
  experience: [
    {
      id: '1',
      company: 'Creative Cloud Agency',
      role: 'Lead Product Designer',
      startDate: 'Mar 2021',
      endDate: 'Present',
      description: '• Directed the end-to-end product design lifecycle for high-profile clients in the fintech space, leading to a 40% increase in mobile app engagement.\n• Mentored a cross-functional team of 4 junior designers focusing on responsive design systems and inclusive accessibility practices.\n• Built comprehensive UI/UX libraries utilized globally across 12 distinct digital product lines.',
    },
    {
      id: '2',
      company: 'Zenith Tech',
      role: 'Senior UI/UX Designer',
      startDate: 'Aug 2017',
      endDate: 'Feb 2021',
      description: '• Conceptualized and delivered an award-winning dashboards interface used by 200,000+ daily active enterprise users.\n• Conducted extensive A/B testing on primary user flows, increasing conversion rates by 18% over two quarters.\n• Collaborated closely with front-end engineering teams to strictly enforce brand guidelines utilizing Storybook and React.',
    },
  ],
  projects: [
    {
      id: '1',
      name: 'Eco-Friendly Travel App UI Kit',
      description: 'A comprehensive, open-source Figma UI kit featuring 150+ components tailored for sustainable travel startups. Reached 10k+ downloads on Figma Community.',
      url: 'https://figma.com/community/file/xxxx',
      startDate: '2022',
      endDate: '2022',
    },
  ],
  skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'UI/UX Design', 'Design Systems', 'Rapid Prototyping', 'User Research', 'HTML/CSS', 'Agile Methodology'],
  interests: ['Analog Photography', 'Typography', 'Sustainable Architecture', 'Mountain Biking'],
  summary: 'Detail-oriented and highly adaptive Senior Brand Designer with over 7 years of experience crafting intuitive digital experiences and robust design systems. Proven track record of aligning user needs with business goals to deliver scalable, award-winning products.',
  certifications: 'Google UX Design Professional Certificate (2020)\nNielsen Norman Group UX Certification (2019)',
  languages: 'English (Native)\nFrench (Professional Working)',
};

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  // View mode controls structural layout directly
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return true; // Default theme dark
  });
  
  // Dropdown UI states
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowUploadMenu(false);
      setShowDownloadMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fileInputRefJSON = useRef<HTMLInputElement>(null);
  const fileInputRefPDF = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

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
    documentTitle: resumeData.header.fullName ? `${resumeData.header.fullName.replace(/\s+/g, '_')}_Resume` : 'Resume'
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
  }, [viewMode]);

  const calculateScore = (data: ResumeData) => {
    let score = 0;
    const suggestions: string[] = [];

    if (data.header.fullName) score += 5; else suggestions.push('Add your full name.');
    if (data.header.headline) score += 5; else suggestions.push('Add a professional headline.');
    if (data.header.email) score += 5; else suggestions.push('Add your email address.');
    if (data.header.contactNumber) score += 5; else suggestions.push('Add a contact number.');
    if (data.header.website) score += 5; else suggestions.push('Add a website/portfolio link.');
    
    if (data.summary.trim().length > 20) score += 10; else suggestions.push('Add a professional summary.');
    if (data.education.length > 0) score += 15; else suggestions.push('Add your educational background.');
    if (data.experience.length > 0) score += 15; else suggestions.push('Add your work experience.');
    if (data.projects && data.projects.length > 0) score += 15; else suggestions.push('Add relevant projects.');
    if (data.skills.length > 0) score += 5; else suggestions.push('Add some key skills.');
    if (data.skills.length > 4) score += 5; else if (data.skills.length > 0) suggestions.push('Add more skills.');
    if (data.profiles && data.profiles.length > 0) score += 5; else suggestions.push('Add social profiles.');
    if (data.interests && data.interests.length > 0) score += 5; else suggestions.push('Add some interests.');

    return { score, suggestions };
  };

  const { score, suggestions } = calculateScore(resumeData);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'resume.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as ResumeData;
        if (json.header !== undefined) {
          setResumeData({
            ...json,
            profiles: json.profiles || [],
            projects: json.projects || [],
            interests: json.interests || [],
            header: {
              ...json.header,
              headline: json.header.headline || '',
              website: json.header.website || ''
            }
          });
        }
      } catch (err) {
        alert('Failed to parse the JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRefJSON.current) fileInputRefJSON.current.value = '';
  };

  const handleImportPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => 'str' in item ? item.str : '');
        fullText += strings.join(' ') + '\n';
      }
      
      const emailMatch = fullText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
      const phoneMatch = fullText.match(/(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/);
      
      setResumeData(prev => ({
        ...prev,
        header: {
           ...prev.header,
           email: emailMatch ? emailMatch[0] : prev.header.email,
           contactNumber: phoneMatch ? phoneMatch[0] : prev.header.contactNumber,
        },
        summary: `[Imported from PDF] Please review and format the extracted text below:\n\n${fullText.substring(0, 3000)}...`
      }));
      alert('PDF successfully parsed! Please manually review the extracted raw text populated in your Professional Summary and distribute it into the correct fields.');
    } catch (err) {
      console.error(err);
      alert('Failed to extract text from the PDF file.');
    }
    if (fileInputRefPDF.current) fileInputRefPDF.current.value = '';
  };

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 z-10 transition-colors duration-200">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          ResumeBuilder
        </h1>
        
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
          
          {/* UPLOAD MENU */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => { setShowUploadMenu(!showUploadMenu); setShowDownloadMenu(false); }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Upload
            </button>
            {showUploadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
                <button 
                  onClick={() => { fileInputRefJSON.current?.click(); setShowUploadMenu(false); }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-zinc-400" />
                  Import JSON
                </button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
                <button 
                  onClick={() => { fileInputRefPDF.current?.click(); setShowUploadMenu(false); }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-zinc-400" />
                  Import PDF
                </button>
              </div>
            )}
          </div>

          {/* DOWNLOAD MENU */}
          <div className="relative ml-1 sm:ml-2" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => { setShowDownloadMenu(!showDownloadMenu); setShowUploadMenu(false); }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Download
            </button>
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
                <button 
                  onClick={() => { handleExportJSON(); setShowDownloadMenu(false); }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-zinc-400" />
                  Export JSON
                </button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
                <button 
                  onClick={() => { handlePrint(); setShowDownloadMenu(false); }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <FileDown className="w-4 h-4 text-zinc-400" />
                  Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container Layout */}
      <main className={`flex-1 flex overflow-hidden relative ${viewMode === 'split' ? 'flex-col lg:flex-row-reverse' : 'flex-col'}`}>
        
        {/* Edit Panel */}
        <div id="edit-panel" className={`w-full ${viewMode === 'split' ? 'lg:w-[50%] xl:w-[45%] lg:border-l lg:border-r-0 border-b lg:border-b-0' : 'flex-1'} border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] overflow-y-auto transition-colors duration-200 ${viewMode === 'edit' || viewMode === 'split' ? 'block' : 'hidden'}`}>
          <div className="p-4 sm:p-6 lg:p-8 space-y-8 pb-32 max-w-5xl mx-auto">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Resume Details</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Fill in your information to generate a professional resume.</p>
              </div>
              <ViewToggleGroup />
            </div>
            
            <div className="space-y-6">
              <PersonalInfoForm data={resumeData.header} onChange={(header) => setResumeData({...resumeData, header})} />
              <ProfilesForm data={resumeData.profiles || []} onChange={(profiles) => setResumeData({...resumeData, profiles})} />
              <AdditionalInfoForm summary={resumeData.summary} certifications={resumeData.certifications} languages={resumeData.languages} onChange={(field, value) => setResumeData({...resumeData, [field]: value})} />
              <ExperienceForm data={resumeData.experience} onChange={(experience) => setResumeData({...resumeData, experience})} />
              <ProjectsForm data={resumeData.projects || []} onChange={(projects) => setResumeData({...resumeData, projects})} />
              <EducationForm data={resumeData.education} onChange={(education) => setResumeData({...resumeData, education})} />
              <SkillsForm data={resumeData.skills} onChange={(skills) => setResumeData({...resumeData, skills})} />
              <InterestsForm data={resumeData.interests || []} onChange={(interests) => setResumeData({...resumeData, interests})} />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div id="preview-panel" className={`w-full ${viewMode === 'split' ? 'lg:w-[50%] xl:w-[55%]' : 'flex-1'} bg-zinc-100 dark:bg-zinc-950 overflow-y-auto transition-colors duration-200 ${viewMode === 'preview' || viewMode === 'split' ? 'block' : 'hidden'}`}>
          <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 lg:space-y-8 pb-32 flex flex-col" ref={previewContainerRef}>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
               <div className="space-y-1">
                 <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Live Preview</h2>
                 <p className="text-sm text-zinc-500 dark:text-zinc-400">Review your generated document in real-time.</p>
               </div>
               <ViewToggleGroup />
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0 transition-colors duration-200">
              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">Resume Strength Analyzer</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Complete all sections to maximize your score.</p>
                  </div>
                  <div className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[5px] ${score >= 80 ? 'border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400' : score >= 50 ? 'border-amber-100 dark:border-amber-900/50 text-amber-500 dark:text-amber-400' : 'border-rose-100 dark:border-rose-900/50 text-rose-500 dark:text-rose-400'} transition-colors duration-200`}>
                    <span className="text-lg sm:text-xl font-bold">{score}%</span>
                  </div>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 mb-5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end ${score >= 80 ? 'bg-emerald-500 dark:bg-emerald-400' : score >= 50 ? 'bg-amber-500 dark:bg-amber-400' : 'bg-rose-500 dark:bg-rose-400'}`} style={{ width: `${score}%` }}>
                  </div>
                </div>
                {suggestions.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 transition-colors duration-200">
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-2 uppercase tracking-wide">Suggested Improvements</h4>
                    <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                      {suggestions.map((suggestion, idx) => (
                         <li key={idx} className="flex items-start gap-2">
                           <span className="text-zinc-400 dark:text-zinc-500 mt-0.5">•</span>
                           <span>{suggestion}</span>
                         </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div 
               className="bg-white rounded-sm shadow-xl border border-zinc-200 dark:border-zinc-800 shrink-0 mx-auto"
               style={{ 
                 width: '800px', 
                 height: '1131px', 
                 transform: `scale(${previewScale})`, 
                 transformOrigin: 'top center',
                 marginBottom: `-${1131 * (1 - previewScale)}px`
               }}
            >
               <ResumePreview ref={printRef} data={resumeData} scale={1} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
