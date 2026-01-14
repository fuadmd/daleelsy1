import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Job, Language, CVData, CVProject, CVExperience, CVEducation, CVCourse } from '../types';
import { translations } from '../translations';
import { supabase } from '../supabase';
import JobCard from '../components/JobCard';

interface UserDashboardProps {
  lang: Language;
  user: User | null;
  jobs: Job[];
  onToggleSave: (id: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ lang, user, jobs, onToggleSave }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'cv' | 'apps' | 'saved' | 'profile'>('cv');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for CV Data
  const [cvData, setCvData] = useState<CVData>({
    fullName: user?.name || '',
    title: '',
    phone: '',
    email: user?.email || '',
    summary: '',
    photo: '',
    experiences: [],
    educations: [],
    courses: [],
    projects: [],
    technicalSkills: [],
    softSkills: [],
    tools: [],
    languages: [],
    interests: [],
    references: lang === 'ar' ? 'متاحة عند الطلب' : 'Available upon request',
    design: {
      templateId: 'modern',
      accentColor: '#3b82f6',
      textColor: '#111827',
      fontFamily: lang === 'ar' ? 'Tajawal' : 'Inter',
      fontSize: 14,
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      showPhoto: true,
      layout: 'standard'
    }
  });

  // Saved Jobs logic
  const savedJobsList = useMemo(() => {
    const ids = user?.savedJobs || [];
    return jobs.filter(j => ids.includes(j.id));
  }, [user, jobs]);

  useEffect(() => {
    if (user) fetchCV();
  }, [user]);

  const fetchCV = async () => {
    if (user?.id.startsWith('demo-')) return;
    const { data, error } = await supabase.from('cvs').select('data').eq('profile_id', user?.id).single();
    if (!error && data) setCvData(data.data as CVData);
  };

  const saveCV = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('cvs').upsert({ profile_id: user.id, data: cvData });
    if (!error) alert(lang === 'ar' ? 'تم حفظ السيرة الذاتية بنجاح' : 'CV saved successfully');
    setSaving(false);
  };

  const addListEntry = (key: keyof CVData, defaultValue: any) => {
    setCvData(prev => ({
      ...prev,
      [key]: [...(prev[key] as any[]), defaultValue]
    }));
  };

  const updateListEntry = (key: keyof CVData, index: number, value: any) => {
    const list = [...(cvData[key] as any[])];
    list[index] = value;
    setCvData({ ...cvData, [key]: list });
  };

  const removeListEntry = (key: keyof CVData, index: number) => {
    setCvData({ ...cvData, [key]: (cvData[key] as any[]).filter((_, i) => i !== index) });
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in print:bg-white">
      {/* Navigation Tabs */}
      <div className="flex bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border dark:border-gray-700 w-fit mx-auto md:mx-0 print:hidden overflow-x-auto max-w-full">
        <button onClick={() => setActiveTab('cv')} className={`px-4 md:px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${activeTab === 'cv' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-primary dark:text-gray-400'}`}><i className="fas fa-file-invoice"></i> {t.cvBuilder}</button>
        <button onClick={() => setActiveTab('apps')} className={`px-4 md:px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${activeTab === 'apps' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-primary dark:text-gray-400'}`}><i className="fas fa-paper-plane"></i> {t.myApplications}</button>
        <button onClick={() => setActiveTab('saved')} className={`px-4 md:px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${activeTab === 'saved' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-primary dark:text-gray-400'}`}><i className="fas fa-bookmark"></i> {t.savedJobs}</button>
        <button onClick={() => setActiveTab('profile')} className={`px-4 md:px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-primary dark:text-gray-400'}`}><i className="fas fa-user-circle"></i> {t.profile}</button>
      </div>

      {activeTab === 'profile' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 border dark:border-gray-700 shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center border-b dark:border-gray-700 pb-8">
              <div className="w-32 h-32 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary text-4xl border-4 border-white dark:border-gray-700 shadow-lg relative group">
                {user.name.charAt(0)}
                <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-[2rem] flex items-center justify-center text-white text-base transition-all">
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              <div className="flex-grow text-center md:text-right space-y-2">
                <h2 className="text-3xl font-black dark:text-white">{user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-bold">{user.email}</p>
                <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{t.candidate}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 uppercase tracking-wider">{t.fullName}</label>
                <input className="app-input" value={user.name} readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 uppercase tracking-wider">{t.summary}</label>
                <textarea className="app-textarea" placeholder={t.summary} rows={4} defaultValue={user.bio} />
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-secondary transition-all active:scale-95">
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cv' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Form Editor */}
          <div className="xl:col-span-7 space-y-8 print:hidden">
            {/* Personal Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border dark:border-gray-700 shadow-xl space-y-6">
              <h3 className="text-xl font-black dark:text-white flex items-center gap-3 border-b dark:border-gray-700 pb-4">
                <i className="fas fa-id-card text-primary"></i> {t.personalInfo}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="app-input" placeholder={t.fullName} value={cvData.fullName} onChange={e => setCvData({...cvData, fullName: e.target.value})} />
                <input className="app-input" placeholder={t.jobTitle} value={cvData.title} onChange={e => setCvData({...cvData, title: e.target.value})} />
                <input className="app-input" placeholder={t.phone} value={cvData.phone} onChange={e => setCvData({...cvData, phone: e.target.value})} />
                <input className="app-input" placeholder={t.email} value={cvData.email} onChange={e => setCvData({...cvData, email: e.target.value})} />
                <div className="md:col-span-2">
                  <textarea className="app-textarea" placeholder={t.summary} value={cvData.summary} onChange={e => setCvData({...cvData, summary: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border dark:border-gray-700 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4">
                <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
                  <i className="fas fa-briefcase text-primary"></i> {t.experience}
                </h3>
                <button onClick={() => addListEntry('experiences', { company: '', role: '', duration: '', description: '' })} className="text-primary font-black hover:bg-primary/10 px-4 py-2 rounded-xl transition-all"><i className="fas fa-plus"></i></button>
              </div>
              {cvData.experiences.map((exp, idx) => (
                <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl space-y-4 relative group border dark:border-gray-700">
                  <button onClick={() => removeListEntry('experiences', idx)} className="absolute top-4 left-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-trash"></i></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="app-input" placeholder="اسم الشركة" value={exp.company} onChange={e => updateListEntry('experiences', idx, {...exp, company: e.target.value})} />
                    <input className="app-input" placeholder="المسمى الوظيفي" value={exp.role} onChange={e => updateListEntry('experiences', idx, {...exp, role: e.target.value})} />
                    <div className="md:col-span-2">
                       <input className="app-input" placeholder="الفترة الزمنية (مثال: 2020 - الحاضر)" value={exp.duration} onChange={e => updateListEntry('experiences', idx, {...exp, duration: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <textarea className="app-textarea" placeholder="وصف المهام" value={exp.description} onChange={e => updateListEntry('experiences', idx, {...exp, description: e.target.value})} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={saveCV} disabled={saving} className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-secondary transition-all active:scale-95 sticky bottom-4 z-20">
              {saving ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> {t.saveCV}</>}
            </button>
          </div>

          {/* Live Preview Paper */}
          <div className="xl:col-span-5 sticky top-24">
            <div className="flex justify-between items-center mb-4 print:hidden">
              <h4 className="font-black text-gray-500 uppercase tracking-widest text-xs"><i className="fas fa-eye"></i> {t.preview}</h4>
              <button onClick={() => window.print()} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-black hover:bg-primary hover:text-white transition-all">
                <i className="fas fa-file-pdf"></i> PDF
              </button>
            </div>
            
            <div 
              style={{ 
                '--cv-accent': cvData.design.accentColor, 
                fontSize: `${cvData.design.fontSize}px`,
                direction: cvData.design.direction 
              } as any}
              className="bg-white rounded-xl shadow-2xl overflow-hidden min-h-[800px] border border-gray-200 p-12 text-gray-900 transition-all duration-300"
            >
              <header className="border-b-4 border-[var(--cv-accent)] pb-8 mb-8 flex flex-col items-center text-center space-y-2">
                <h1 className="text-4xl font-black uppercase tracking-tight" style={{ color: 'var(--cv-accent)' }}>{cvData.fullName || 'الاسم الكامل'}</h1>
                <p className="text-xl font-bold opacity-80">{cvData.title || 'المسمى الوظيفي'}</p>
                <div className="flex flex-wrap justify-center gap-6 pt-4 text-[13px] font-medium text-gray-500">
                   {cvData.phone && <span><i className="fas fa-phone mr-2" style={{ color: 'var(--cv-accent)' }}></i> {cvData.phone}</span>}
                   {cvData.email && <span><i className="fas fa-envelope mr-2" style={{ color: 'var(--cv-accent)' }}></i> {cvData.email}</span>}
                </div>
              </header>

              <div className="grid grid-cols-1 gap-10">
                {cvData.summary && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3" style={{ color: 'var(--cv-accent)' }}>
                       {t.summary} <div className="flex-grow h-[1px] bg-gray-100"></div>
                    </h3>
                    <p className="leading-relaxed opacity-90">{cvData.summary}</p>
                  </section>
                )}

                {cvData.experiences.length > 0 && (
                  <section className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3" style={{ color: 'var(--cv-accent)' }}>
                       {t.experience} <div className="flex-grow h-[1px] bg-gray-100"></div>
                    </h3>
                    <div className="space-y-8">
                      {cvData.experiences.map((exp, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-start">
                             <h4 className="font-black text-[1.1em]">{exp.role}</h4>
                             <span className="text-[0.9em] font-bold text-gray-400">{exp.duration}</span>
                          </div>
                          <p className="font-bold text-primary text-[0.95em]" style={{ color: 'var(--cv-accent)' }}>{exp.company}</p>
                          <p className="opacity-80 pt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ساير التبويبات تظل كما هي مع التأكد من الألوان */}
      {activeTab === 'saved' && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-2xl font-black dark:text-white flex items-center gap-3">
            <i className="fas fa-bookmark text-primary"></i> {t.savedJobs}
          </h3>
          <div className="grid gap-6">
            {savedJobsList.length > 0 ? (
              savedJobsList.map(job => (
                <JobCard key={job.id} job={job} lang={lang} onClick={() => {}} onToggleSave={() => onToggleSave(job.id)} isSaved={true} />
              ))
            ) : (
              <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed dark:border-gray-700">
                <i className="fas fa-bookmark text-4xl text-gray-200 mb-4"></i>
                <p className="text-gray-400 font-bold">{lang === 'ar' ? 'لم تقم بحفظ أي وظائف بعد' : 'No saved jobs yet'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;