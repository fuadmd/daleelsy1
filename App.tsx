<<<<<<< HEAD
=======

>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
import React, { useState, useEffect } from 'react';
import { User, UserRole, Language, Job, AppSettings } from './types';
import { translations } from './translations';
import { supabase } from './supabase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import JobDetailModal from './components/JobDetailModal';
import './index.css';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'admin' | 'employer' | 'user' | 'login'>('home');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('daleelsy_settings');
    if (saved) return JSON.parse(saved);
    return {
      lightPrimaryColor: '#3b82f6',
      lightSecondaryColor: '#1e40af',
      darkPrimaryColor: '#60a5fa',
      darkSecondaryColor: '#1d4ed8',
      language: 'ar',
      theme: 'light',
      bgPatternUrl: '',
      bgPatternScale: 100,
      bgPatternOpacity: 0.1,
      bannerImages: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
      ],
      footerTextAr: "جميع الحقوق محفوظة © دليل التوظيف السوري",
      footerTextEn: "All rights reserved © DaleelSy Jobs Portal",
      adSliderTitleAr: "أفضل الفرص بانتظارك",
      adSliderTitleEn: "Top Opportunities Await You",
      heroTitleAr: "دليل سوري: أحدث الوظائف",
      heroTitleEn: "DaleelSy: Latest Jobs",
      heroSubtitleAr: "ابحث عن وظيفة أحلامك في سوريا اليوم. آلاف الفرص بانتظارك.",
      heroSubtitleEn: "Find your dream job in Syria today. Thousands of opportunities await you.",
      heroBgColor: "#2563eb",
      heroImage: "",
      adminNotificationEmails: "admin@daleelsy.com"
    };
  });

  useEffect(() => {
<<<<<<< HEAD
    // مراقبة حالة المصادقة من Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setCurrentUser(profile as User);
        }
      } else {
        setCurrentUser(null);
      }
    });

    fetchJobs();
    return () => subscription.unsubscribe();
  }, []);

=======
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchProfile(session.user.id);
      else setCurrentUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
<<<<<<< HEAD
    if (!error && data) {
      setJobs(data as Job[]);
=======
    if (!error && data) setJobs(data as Job[]);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setCurrentUser(data as User);
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
    }
    setLoading(false);
  };

<<<<<<< HEAD
  const handleToggleSaveJob = async (jobId: string) => {
    if (!currentUser) {
      setCurrentPage('login');
      return;
    }
    const currentSaved = currentUser.savedJobs || [];
    const isSaved = currentSaved.includes(jobId);
    const newSaved = isSaved ? currentSaved.filter(id => id !== jobId) : [...currentSaved, jobId];
    
    // التحديث في قاعدة البيانات
    await supabase.from('profiles').update({ saved_jobs: newSaved }).eq('id', currentUser.id);
    setCurrentUser({ ...currentUser, savedJobs: newSaved });
  };

  const handleAddJobLocal = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
  };

  const handleUpdateJobLocal = (updatedJob: Job) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
  };

  const handleDeleteJobLocal = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

=======
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
  useEffect(() => {
    const isDark = settings.theme === 'dark';
    const activePrimary = isDark ? settings.darkPrimaryColor : settings.lightPrimaryColor;
    const activeSecondary = isDark ? settings.darkSecondaryColor : settings.lightSecondaryColor;

    document.documentElement.style.setProperty('--primary-color', activePrimary);
    document.documentElement.style.setProperty('--secondary-color', activeSecondary);
    document.documentElement.classList.toggle('dark', isDark);
    
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.className = `bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 lang-${lang} transition-colors duration-300`;
  }, [lang, settings]);

  const toggleTheme = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentPage('home');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin text-primary text-4xl"><i className="fas fa-circle-notch"></i></div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col relative`}>
<<<<<<< HEAD
      {settings.bgPatternUrl && (
        <div 
          className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-500" 
          style={{
            backgroundImage: `url(${settings.bgPatternUrl})`,
            backgroundSize: `${settings.bgPatternScale}%`,
            opacity: settings.bgPatternOpacity,
          }}
        />
      )}

      <Navbar 
        lang={lang} 
        setLang={setLang} 
        currentUser={currentUser} 
        onLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        theme={settings.theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <Home 
            lang={lang} 
            jobs={jobs} 
            onSelectJob={setSelectedJob} 
            settings={settings}
            onToggleSave={handleToggleSaveJob}
            savedJobs={currentUser?.savedJobs || []}
          />
        )}
        {currentPage === 'admin' && (
          <AdminDashboard 
            lang={lang} 
            settings={settings} 
            setSettings={setSettings} 
            jobs={jobs}
            onAddJob={handleAddJobLocal}
            onUpdateJob={handleUpdateJobLocal}
            onDeleteJob={handleDeleteJobLocal}
          />
        )}
        {currentPage === 'employer' && (
          <EmployerDashboard 
            lang={lang} 
            jobs={jobs} 
            employerId={currentUser?.id || ''} 
            user={currentUser}
            onAdd={handleAddJobLocal} 
            onUpdate={handleUpdateJobLocal} 
            onDelete={handleDeleteJobLocal} 
          />
        )}
        {currentPage === 'user' && (
          <UserDashboard 
            lang={lang} 
            user={currentUser} 
            jobs={jobs} 
            onToggleSave={handleToggleSaveJob} 
          />
        )}
        {currentPage === 'login' && <Login lang={lang} onLogin={() => setCurrentPage('home')} />}
      </main>

      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          lang={lang} 
          user={currentUser}
          onClose={() => setSelectedJob(null)} 
          onRedirectToLogin={() => {
            setSelectedJob(null);
            setCurrentPage('login');
          }}
        />
      )}

      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t dark:border-gray-700 py-10 text-center flex flex-col items-center space-y-4">
        <p className="text-gray-600 dark:text-gray-300 font-bold px-4">{lang === 'ar' ? settings.footerTextAr : settings.footerTextEn}</p>
        <div className="pt-4 mt-4 border-t dark:border-gray-700/50 w-full max-w-sm flex flex-col items-center gap-2">
            <p className="text-sm font-black text-primary">برمجة : فؤاد الدنيفات أبوالحارث</p>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm tracking-wide" dir="ltr">
               <i className="fas fa-phone-alt mr-2 text-primary opacity-50"></i>
               +963 994 06 07 08
            </p>
        </div>
      </footer>
=======
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar 
          lang={lang} 
          setLang={setLang} 
          currentUser={currentUser} 
          onLogout={handleLogout}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          theme={settings.theme}
          toggleTheme={toggleTheme}
        />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {currentPage === 'home' && <Home lang={lang} jobs={jobs} onSelectJob={setSelectedJob} settings={settings} />}
          {currentPage === 'admin' && <AdminDashboard lang={lang} settings={settings} setSettings={setSettings} />}
          {currentPage === 'employer' && <EmployerDashboard lang={lang} jobs={jobs} employerId={currentUser?.id || ''} onAdd={fetchJobs} onUpdate={fetchJobs} onDelete={fetchJobs} />}
          {currentPage === 'user' && <UserDashboard lang={lang} user={currentUser} jobs={jobs} />}
          {currentPage === 'login' && <Login lang={lang} onLogin={() => setCurrentPage('home')} />}
        </main>

        {selectedJob && <JobDetailModal job={selectedJob} lang={lang} onClose={() => setSelectedJob(null)} />}

        <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t dark:border-gray-700 py-6 text-center text-gray-500 dark:text-gray-400">
          <p>{lang === 'ar' ? settings.footerTextAr : settings.footerTextEn}</p>
        </footer>
      </div>
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
    </div>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
