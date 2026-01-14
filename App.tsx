import React, { useState, useEffect } from 'react';
import { User, Language, Job, AppSettings } from './types';
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
  const [currentPage, setCurrentPage] =
    useState<'home' | 'admin' | 'employer' | 'user' | 'login'>('home');
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
      bannerImages: [],
      footerTextAr: 'جميع الحقوق محفوظة © دليل التوظيف السوري',
      footerTextEn: 'All rights reserved © DaleelSy Jobs Portal',
      adSliderTitleAr: 'أفضل الفرص بانتظارك',
      adSliderTitleEn: 'Top Opportunities Await You',
      heroTitleAr: 'دليل سوري: أحدث الوظائف',
      heroTitleEn: 'DaleelSy: Latest Jobs',
      heroSubtitleAr: 'ابحث عن وظيفة أحلامك في سوريا اليوم',
      heroSubtitleEn: 'Find your dream job today',
      heroBgColor: '#2563eb',
      heroImage: '',
      adminNotificationEmails: 'admin@daleelsy.com'
    };
  });

  // Auth + profile
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) fetchProfile(session.user.id);
        else {
          setCurrentUser(null);
          setLoading(false);
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  // Jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) setCurrentUser(data as User);
    setLoading(false);
  };

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setJobs(data as Job[]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentPage('home');
  };

  useEffect(() => {
    const isDark = settings.theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang, settings.theme]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        lang={lang}
        setLang={setLang}
        currentUser={currentUser}
        onLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        theme={settings.theme}
        toggleTheme={() =>
          setSettings(s => ({
            ...s,
            theme: s.theme === 'light' ? 'dark' : 'light'
          }))
        }
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <Home
            lang={lang}
            jobs={jobs}
            onSelectJob={setSelectedJob}
            settings={settings}
          />
        )}
        {currentPage === 'admin' && (
          <AdminDashboard
            lang={lang}
            settings={settings}
            setSettings={setSettings}
            jobs={jobs}
          />
        )}
        {currentPage === 'employer' && currentUser && (
          <EmployerDashboard
            lang={lang}
            jobs={jobs}
            employerId={currentUser.id}
          />
        )}
        {currentPage === 'user' && currentUser && (
          <UserDashboard lang={lang} user={currentUser} jobs={jobs} />
        )}
        {currentPage === 'login' && (
          <Login lang={lang} onLogin={() => setCurrentPage('home')} />
        )}
      </main>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          lang={lang}
          user={currentUser}
          onClose={() => setSelectedJob(null)}
        />
      )}

      <footer className="text-center py-6 text-gray-500">
        {lang === 'ar' ? settings.footerTextAr : settings.footerTextEn}
      </footer>
    </div>
  );
};

export default App;
