
import React, { useState } from 'react';
import { Job, Language } from '../types';
import { translations } from '../translations';
import { generateJobSummary } from '../services/gemini';

interface JobCardProps {
  job: Job;
  lang: Language;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, lang, onClick }) => {
  const t = translations[lang];
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAiSummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (aiSummary) return;
    setLoadingAi(true);
    const summary = await generateJobSummary(job.description, lang);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-secondary"
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-primary shrink-0 transition-all group-hover:bg-secondary/10 group-hover:text-secondary overflow-hidden border dark:border-gray-700">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={job.company} 
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<i class="fas fa-building text-2xl"></i>';
                }}
              />
            ) : (
              <i className="fas fa-building text-2xl"></i>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold group-hover:text-secondary transition-all text-title-contrast">{job.title}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <i className="fas fa-city text-xs text-secondary/70"></i> {job.company}
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-map-marker-alt text-xs text-secondary/70"></i> {t[job.region as keyof typeof t]} {job.subRegion && `(${job.subRegion})`}
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-briefcase text-xs text-secondary/70"></i> {t[job.specialty.toLowerCase() as keyof typeof t]}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
          <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
            {t.active}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{job.postedAt}</span>
        </div>
      </div>

      <div className="mt-4 text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
        {job.description}
      </div>

      {aiSummary && (
        <div className="mt-4 p-4 bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 dark:border-secondary/30 rounded-xl text-sm italic text-gray-800 dark:text-gray-200 animate-fade-in">
          <div className="flex items-center gap-2 mb-1 font-bold text-secondary">
            <i className="fas fa-robot"></i> AI Summary:
          </div>
          {aiSummary}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between border-t dark:border-gray-700 pt-4">
        <div className="flex gap-2">
          <button 
            onClick={handleAiSummary}
            disabled={loadingAi}
            className="text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-secondary px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-bold transition-all"
          >
            {loadingAi ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
            {lang === 'ar' ? 'ملخص ذكي' : 'Smart Summary'}
          </button>
        </div>
        <button 
          className="bg-primary text-white px-8 py-2 rounded-xl hover:bg-secondary font-bold transition-all shadow-md transform active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
