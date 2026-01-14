import React, { useState } from 'react';
import { Job, Language } from '../types';
import { translations } from '../translations';
import { generateJobSummary } from '../services/gemini';

interface JobCardProps {
  job: Job;
  lang: Language;
  onClick: () => void;
  onToggleSave?: () => void;
  isSaved?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, lang, onClick, onToggleSave, isSaved }) => {
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

  const isExpired = new Date(job.expiresAt) < new Date();

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 border-2 dark:border-gray-700 rounded-[2.5rem] p-6 hover:shadow-2xl transition-all group cursor-pointer border-transparent hover:border-primary animate-fade-in relative ${isExpired ? 'opacity-70' : ''}`}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleSave?.(); }}
        className={`absolute top-6 left-6 w-11 h-11 rounded-2xl flex items-center justify-center transition-all z-10 shadow-sm ${isSaved ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-primary'}`}
      >
        <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark text-lg`}></i>
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-3xl flex items-center justify-center text-primary text-3xl shrink-0 group-hover:scale-105 transition-transform overflow-hidden border-2 dark:border-gray-600 shadow-inner">
          {job.companyLogo ? <img src={job.companyLogo} className="w-full h-full object-contain p-2" alt="" /> : <i className="fas fa-building opacity-20"></i>}
        </div>
        <div className="flex-grow space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
            {isExpired && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm">{t.expired}</span>
            )}
          </div>
          <p className="text-primary font-bold text-lg">{job.company}</p>
          <div className="flex flex-wrap gap-4 text-xs font-black text-gray-400 uppercase tracking-widest pt-1">
            <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-xl"><i className="fas fa-map-marker-alt text-primary/60"></i> {t[job.region as keyof typeof t]}</span>
            <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-xl"><i className="fas fa-briefcase text-primary/60"></i> {t[job.specialty.toLowerCase() as keyof typeof t] || job.specialty}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 text-gray-600 dark:text-gray-400 text-sm line-clamp-2 font-medium leading-relaxed">
        {job.description}
      </div>

      {aiSummary && (
        <div className="mt-4 p-5 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[1.5rem] text-xs leading-relaxed text-gray-700 dark:text-gray-200 animate-zoom-in">
          <div className="flex items-center gap-2 mb-1 font-black text-primary uppercase text-[10px] tracking-widest"><i className="fas fa-robot"></i> AI INSIGHT</div>
          {aiSummary}
        </div>
      )}

      <div className="mt-8 pt-5 border-t dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button onClick={handleAiSummary} disabled={loadingAi} className="text-xs font-black text-primary hover:bg-primary/10 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all">
          {loadingAi ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
          {lang === 'ar' ? 'ملخص ذكي' : 'Smart Summary'}
        </button>
        <button className="w-full sm:w-auto bg-primary text-white px-10 py-3 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 group-hover:bg-secondary transition-all transform active:scale-95">
          {isExpired ? 'مشاهدة الإعلان المنتهي' : 'عرض التفاصيل والتقديم'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;