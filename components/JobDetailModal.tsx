import React from 'react';
import { Job, Language, User } from '../types';
import { translations } from '../translations';

interface JobDetailModalProps {
  job: Job;
  lang: Language;
  user: User | null;
  onClose: () => void;
  onRedirectToLogin: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, lang, user, onClose, onRedirectToLogin }) => {
  const t = translations[lang];

  const handleApply = () => {
    if (!user) {
      onRedirectToLogin();
      return;
    }

    if (job.externalApplyUrl) {
      window.open(job.externalApplyUrl, '_blank');
    } else {
      alert(lang === 'ar' ? 'يرجى التقديم عبر الرابط الخارجي المتوفر.' : 'Please use the external application link.');
    }
  };

  const isExpired = new Date(job.expiresAt) < new Date();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden animate-zoom-in flex flex-col transition-colors border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="relative h-32 bg-primary shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all"
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="absolute bottom-[-30px] left-8 w-20 h-20 bg-white dark:bg-gray-700 rounded-2xl shadow-xl flex items-center justify-center text-primary text-2xl border-4 border-white dark:border-gray-800 overflow-hidden">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-2" />
            ) : (
              <i className="fas fa-building"></i>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar px-8 pt-12 pb-6 space-y-6">
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{job.title}</h2>
              {isExpired && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">{t.expired}</span>
              )}
            </div>
            <p className="text-primary font-bold text-lg">{job.company}</p>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 pt-2">
              <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-primary"></i>
                {t[job.region as keyof typeof t]} {job.subRegion && `(${job.subRegion})`}
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <i className="fas fa-briefcase text-primary"></i>
                {t[job.specialty.toLowerCase() as keyof typeof t] || job.specialty}
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-red-400">
                <i className="fas fa-calendar-times"></i>
                {lang === 'ar' ? 'ينتهي في' : 'Expires'}: {job.expiresAt}
              </span>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-lg font-black mb-3 dark:text-white flex items-center gap-2">
              <i className="fas fa-align-left text-primary"></i>
              {lang === 'ar' ? 'وصف الوظيفة والمتطلبات' : 'Description'}
            </h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {job.description}
            </p>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="shrink-0 p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleApply}
            disabled={isExpired}
            className={`flex-grow py-4 rounded-xl font-black text-lg shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-3 ${isExpired ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:opacity-90'}`}
          >
            <i className="fas fa-paper-plane"></i>
            {isExpired ? (lang === 'ar' ? 'الإعلان منتهي' : 'Expired') : t.applyNow}
          </button>
          <button 
            className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            onClick={onClose}
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;