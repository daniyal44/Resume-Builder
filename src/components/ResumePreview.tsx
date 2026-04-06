import { forwardRef } from 'react';
import type { ResumeData } from '../types/resume';
import Classic from './templates/Classic';
import ModernSidebar from './templates/ModernSidebar';
import BoldHeader from './templates/BoldHeader';
import Pikachu from './templates/Pikachu';
import Minimal from './templates/Minimal';
import CreativeGrid from './templates/CreativeGrid';
import ProfessionalSplit from './templates/ProfessionalSplit';
import ElegantMinimal from './templates/ElegantMinimal';

interface Props {
  data: ResumeData;
  scale?: number;
}

const ResumePreview = forwardRef<HTMLDivElement, Props>(({ data, scale = 1 }, ref) => {
  const { templateId } = data;

  // Dispatcher for templates
  const renderTemplate = () => {
    switch (templateId) {
      case 'modern-sidebar':
        return <ModernSidebar data={data} ref={ref} />;
      case 'bold-header':
        return <BoldHeader data={data} ref={ref} />;
      case 'pikachu':
        return <Pikachu data={data} ref={ref} />;
      case 'minimal':
        return <Minimal data={data} ref={ref} />;
      case 'creative-grid':
        return <CreativeGrid data={data} ref={ref} />;
      case 'professional-split':
        return <ProfessionalSplit data={data} ref={ref} />;
      case 'elegant-minimal':
        return <ElegantMinimal data={data} ref={ref} />;
      case 'classic':
      default:
        return <Classic data={data} ref={ref} />;
    }
  };

  return (
    <div 
      className="bg-white w-full h-full shadow-sm antialiased overflow-hidden"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {renderTemplate()}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
