import React, { useState, useMemo, useEffect } from 'react';
import { Job, Language, AppSettings } from '../types';
import { translations } from '../translations';
import JobCard from '../components/JobCard';

interface HomeProps {
  lang: Language;
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  settings: AppSettings;
  onToggleSave: (id: string) => void;
  savedJobs: string[];
}

const Home: React.FC<HomeProps> = ({ lang, jobs, onSelectJob, settings, onToggleSave, savedJobs }) => {
  const t = translations[lang];
  const [filterRegion, setFilterRegion] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (settings.bannerImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % settings.bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [settings.bannerImages]);

  const filteredJobs = useMemo(() => {
    const now = new Date();
    // Reset hours for fair date comparison
    now.setHours(0, 0, 0, 0);

    return jobs.filter(job => {
      // Logic for active job: must be marked 'active' AND within date range
      const startDate = new Date(job.postedAt);
      const endDate = new Date(job.expiresAt);
      startDate.setHours(0,0,0,0);
      endDate.setHours(23,59,59,999);

      const isActive = job.status === 'active';
      const isWithinDateRange = now >= startDate && now <= endDate;

      // Hide if inactive or out of date range
      if (!isActive || !isWithinDateRange) return false;

      const matchRegion = !filterRegion || job.region === filterRegion;
      const matchSpecialty = !filterSpecialty || job.specialty === filterSpecialty;
      const matchSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());

      return matchRegion && matchSpecialty && matchSearch;
    });
  }, [jobs, filterRegion, filterSpecialty, searchQuery]);

  const governorates = [
    'damascus', 'rif_dimashq', 'aleppo', 'homs', 'hama', 'latakia', 'tartus',
    'idlib', 'raqqa', 'deir_ez_zor', 'hasakah', 'daraa', 'suwayda', 'quneitra'
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Ad Slider */}
      {settings.bannerImages.length > 0 && (
        <section className="relative w-full h-[200px] md:h-[350px] rounded-[2.5rem] overflow-hidden shadow-2xl border dark:border-gray-700">
          {settings.bannerImages.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={img} alt={`Banner ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-10">
                <div className="text-white">
                  <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 inline-block shadow-lg">إعلان مميز</span>
                  <h2 className="text-3xl md:text-4xl font-black drop-shadow-xl">{lang === 'ar' ? settings.adSliderTitleAr : settings.adSliderTitleEn}</h2>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Hero Section */}
      <section 
        style={{ 
          backgroundColor: settings.heroBgColor,
          backgroundImage: settings.heroImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${settings.heroImage})` : 'none',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}
        className="rounded-[2.5rem] p-12 text-white text-center relative overflow-hidden shadow-2xl transition-all"
      >
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-black drop-shadow-lg">{lang === 'ar' ? settings.heroTitleAr : settings.heroTitleEn}</h1>
          <p className="text-lg opacity-90 font-medium">{lang === 'ar' ? settings.heroSubtitleAr : settings.heroSubtitleEn}</p>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-grow flex items-center px-4">
              <i className="fas fa-search text-gray-400 mr-2 ml-2"></i>
              <input 
                type="text" placeholder={t.searchPlaceholder}
                className="w-full py-4 outline-none bg-transparent text-gray-900 dark:text-white font-bold"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select className="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-xl text-gray-900 dark:text-white font-black outline-none border-none" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
                <option value="">{t.allRegions}</option>
                {governorates.map(gov => <option key={gov} value={gov}>{t[gov as keyof typeof t]}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-primary">
                <i className="fas fa-filter"></i> {t.allSpecialties}
              </h3>
              <div className="space-y-3">
                {['IT', 'Engineering', 'Medical', 'Management'].map(spec => (
                  <button 
                    key={spec} 
                    onClick={() => setFilterSpecialty(filterSpecialty === spec ? '' : spec)}
                    className={`w-full text-right p-3 rounded-xl text-sm font-bold transition-all ${filterSpecialty === spec ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                  >
                    {t[spec.toLowerCase() as keyof typeof t] || spec}
                  </button>
                ))}
              </div>
           </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
           {filteredJobs.length > 0 ? (
             <div className="grid gap-6">
                {filteredJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    lang={lang} 
                    onClick={() => onSelectJob(job)} 
                    onToggleSave={() => onToggleSave(job.id)}
                    isSaved={savedJobs.includes(job.id)}
                  />
                ))}
             </div>
           ) : (
             <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed dark:border-gray-700">
                <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <p className="opacity-50 font-black text-gray-400">لا يوجد وظائف متاحة حالياً تطابق بحثك</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Home;