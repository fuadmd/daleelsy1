
import React, { useState, useMemo, useEffect } from 'react';
import { Job, Language, AppSettings } from '../types';
import { translations } from '../translations';
import JobCard from '../components/JobCard';

interface HomeProps {
  lang: Language;
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  settings: AppSettings;
}

const Home: React.FC<HomeProps> = ({ lang, jobs, onSelectJob, settings }) => {
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
    return jobs.filter(job => {
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
      {/* Banner / Ads Slider */}
      {settings.bannerImages.length > 0 && (
        <section className="relative w-full h-[200px] md:h-[350px] rounded-3xl overflow-hidden shadow-xl border dark:border-gray-700">
          {settings.bannerImages.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={img} alt={`Banner ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                <div className="text-white">
                  <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block shadow-sm">
                    {lang === 'ar' ? 'إعلان مميز' : 'Featured Ad'}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg text-white">
                    {lang === 'ar' ? settings.adSliderTitleAr : settings.adSliderTitleEn}
                  </h2>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {settings.bannerImages.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentBannerIndex ? 'bg-white w-8 shadow-md' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section 
        style={{ 
          backgroundColor: settings.heroBgColor,
          backgroundImage: settings.heroImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${settings.heroImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden transition-all shadow-lg"
      >
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
            {lang === 'ar' ? settings.heroTitleAr : settings.heroTitleEn}
          </h1>
          <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto drop-shadow-sm font-medium opacity-90">
            {lang === 'ar' ? settings.heroSubtitleAr : settings.heroSubtitleEn}
          </p>
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2 transition-colors">
            <div className="flex-grow flex items-center px-4">
              <i className="fas fa-search text-gray-400 dark:text-gray-500 mr-2 ml-2"></i>
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full py-3 outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 p-1">
              <select 
                className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-100 outline-none border-0 transition-colors cursor-pointer font-bold focus:ring-2 focus:ring-primary/20"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                <option value="" className="dark:bg-gray-800">{t.allRegions}</option>
                {governorates.map(gov => (
                  <option key={gov} value={gov} className="dark:bg-gray-800">{t[gov as keyof typeof t]}</option>
                ))}
              </select>
              <select 
                className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-100 outline-none border-0 transition-colors cursor-pointer font-bold focus:ring-2 focus:ring-primary/20"
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
              >
                <option value="" className="dark:bg-gray-800">{t.allSpecialties}</option>
                <option value="IT" className="dark:bg-gray-800">{t.it}</option>
                <option value="Engineering" className="dark:bg-gray-800">{t.engineering}</option>
                <option value="Medical" className="dark:bg-gray-800">{t.medical}</option>
                <option value="Management" className="dark:bg-gray-800">{t.management}</option>
              </select>
            </div>
          </div>
        </div>
        {!settings.heroImage && (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 opacity-20"></div>
          </>
        )}
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary dark:text-primary">
              <i className="fas fa-filter"></i>
              {t.region}
            </h3>
            <div className="space-y-3">
              {governorates.slice(0, 5).map(reg => (
                <label key={reg} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-all text-gray-700 dark:text-gray-200">
                  <input 
                    type="radio" 
                    name="region" 
                    checked={filterRegion === reg}
                    onChange={() => setFilterRegion(reg)}
                    className="w-4 h-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                  />
                  <span>{t[reg as keyof typeof t]}</span>
                </label>
              ))}
              <button 
                onClick={() => setFilterRegion('')}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors mt-2"
              >
                {t.allRegions}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary dark:text-primary">
              <i className="fas fa-layer-group"></i>
              {t.specialty}
            </h3>
            <div className="space-y-3">
              {['IT', 'Engineering', 'Medical', 'Management'].map(spec => (
                <label key={spec} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-all text-gray-700 dark:text-gray-200">
                  <input 
                    type="radio" 
                    name="specialty" 
                    checked={filterSpecialty === spec}
                    onChange={() => setFilterSpecialty(spec)}
                    className="w-4 h-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                  />
                  <span>{t[spec.toLowerCase() as keyof typeof t]}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <i className="fas fa-list text-primary"></i>
              {t.latestJobs} ({filteredJobs.length})
            </h2>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  lang={lang} 
                  onClick={() => onSelectJob(job)} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm border dark:border-gray-700 text-center transition-colors">
              <i className="fas fa-search-minus text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
              <p className="text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'لم يتم العثور على نتائج للبحث الحالي.' : 'No results found for your current search.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
