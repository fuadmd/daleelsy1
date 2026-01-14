<<<<<<< HEAD
import React from 'react';
import { Job, Language, User } from '../types';
=======

import React from 'react';
import { Job, Language } from '../types';
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
import { translations } from '../translations';

interface JobDetailModalProps {
  job: Job;
  lang: Language;
<<<<<<< HEAD
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
=======
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, lang, onClose }) => {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-zoom-in transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-40 bg-primary overflow-hidden transition-colors duration-300">
          <div className="absolute top-6 right-6 z-10">
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-white/10"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <div className="absolute bottom-[-40px] left-10 w-28 h-28 bg-white dark:bg-gray-700 rounded-full shadow-2xl flex items-center justify-center text-primary dark:text-primary text-4xl border-4 border-gray-50 dark:border-gray-800 transition-all overflow-hidden">
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-2" />
            ) : (
              <i className="fas fa-building"></i>
            )}
          </div>
<<<<<<< HEAD
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
=======
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        <div className="px-10 pt-16 pb-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-gray-900 dark:text-gray-50">{job.title}</h2>
            <div className="flex items-center gap-2">
              <p className="text-primary dark:text-primary font-extrabold text-xl transition-colors">{job.company}</p>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-green-600 dark:text-green-400 font-bold text-sm uppercase">{t.active}</span>
            </div>
            <div className="flex flex-wrap gap-5 text-sm font-medium text-gray-500 dark:text-gray-300 pt-3">
              <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
                <i className="fas fa-map-marker-alt text-primary"></i>
                {t[job.region as keyof typeof t]} {job.subRegion && `(${job.subRegion})`}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
                <i className="fas fa-briefcase text-primary"></i>
                {t[job.specialty.toLowerCase() as keyof typeof t]}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
                <i className="fas fa-calendar-alt text-primary"></i>
                {job.postedAt}
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
              </span>
            </div>
          </div>

<<<<<<< HEAD
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
=======
          <div className="border-t dark:border-gray-700 pt-8">
            <h3 className="text-2xl font-black mb-4 dark:text-white flex items-center gap-2">
              <i className="fas fa-align-left text-primary"></i>
              {lang === 'ar' ? 'تفاصيل الوظيفة' : 'Job Details'}
            </h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-lg">
              {job.description}
            </p>
          </div>

          {job.attachments && job.attachments.length > 0 && (
            <div className="border-t dark:border-gray-700 pt-8">
              <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                <i className="fas fa-paperclip text-primary"></i>
                {lang === 'ar' ? 'المرفقات والوثائق' : 'Attachments & Documents'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.attachments.map((url, idx) => (
                  <a 
                    key={idx} 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 px-5 py-4 bg-primary/5 dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-gray-600 rounded-2xl border border-primary/10 dark:border-gray-600 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-primary dark:text-primary shadow-sm">
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{lang === 'ar' ? `مرفق رقم ${idx + 1}` : `Document ${idx + 1}`}</span>
                    </div>
                    <i className="fas fa-download text-gray-400 group-hover:text-primary transition-colors"></i>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-10 border-t dark:border-gray-700 flex flex-col sm:flex-row gap-4">
            {job.externalApplyUrl ? (
              <a 
                href={job.externalApplyUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-grow bg-primary text-white text-center py-5 rounded-2xl font-black text-xl shadow-xl hover:opacity-90 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <i className="fas fa-paper-plane"></i>
                {t.applyNow}
              </a>
            ) : (
              <button className="flex-grow bg-primary text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:opacity-90 transform hover:scale-[1.02] transition-all">
                {t.applyNow}
              </button>
            )}
            <button 
              className="px-10 py-5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-black text-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm"
              onClick={onClose}
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default JobDetailModal;
=======
export default JobDetailModal;
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
