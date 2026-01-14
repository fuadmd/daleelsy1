
import React, { useState, useEffect } from 'react';
import { User, Job, Language, CVData } from '../types';
import { translations } from '../translations';
import { supabase } from '../supabase';

interface UserDashboardProps {
  lang: Language;
  user: User | null;
  jobs: Job[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ lang, user, jobs }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'profile' | 'cv'>('profile');
  const [isPreview, setIsPreview] = useState(false);
  const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal'>('classic');
  const [saving, setSaving] = useState(false);

  const [cvData, setCvData] = useState<CVData>({
    fullName: user?.name || '',
    title: '',
    phone: '',
    email: user?.email || '',
    summary: '',
    experiences: [],
    educations: [],
    courses: [],
    skills: [],
    languages: [],
    design: {
      accentColor: '#1e40af',
      textColor: '#111827',
      fontFamily: 'var(--font-ar)',
      fontSize: 14,
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      showPhoto: true,
    }
  });

  useEffect(() => {
    if (user) {
      fetchCV();
    }
  }, [user]);

  const fetchCV = async () => {
    const { data, error } = await supabase
      .from('cvs')
      .select('data')
      .eq('profile_id', user?.id)
      .single();
    
    if (!error && data) {
      setCvData(data.data as CVData);
    }
  };

  const saveCV = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('cvs')
      .upsert({ profile_id: user.id, data: cvData });
    
    if (error) alert(lang === 'ar' ? 'خطأ في الحفظ' : 'Error saving');
    else alert(lang === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully');
    setSaving(false);
  };

  const addExperience = () => setCvData({ ...cvData, experiences: [...cvData.experiences, { company: '', role: '', duration: '', description: '' }] });
  const addEducation = () => setCvData({ ...cvData, educations: [...cvData.educations, { school: '', degree: '', year: '' }] });
  const addCourse = () => setCvData({ ...cvData, courses: [...cvData.courses, { title: '', institution: '', year: '' }] });
  const addLanguage = () => setCvData({ ...cvData, languages: [...cvData.languages, { name: '', level: 5 }] });
  
  const removeExperience = (idx: number) => setCvData({ ...cvData, experiences: cvData.experiences.filter((_, i) => i !== idx) });
  const removeEducation = (idx: number) => setCvData({ ...cvData, educations: cvData.educations.filter((_, i) => i !== idx) });
  const removeCourse = (idx: number) => setCvData({ ...cvData, courses: cvData.courses.filter((_, i) => i !== idx) });
  const removeLanguage = (idx: number) => setCvData({ ...cvData, languages: cvData.languages.filter((_, i) => i !== idx) });

  const exportPdf = () => {
    if (!isPreview) {
      setIsPreview(true);
      setTimeout(() => window.print(), 300);
    } else {
      window.print();
    }
  };

  if (!user) return null;

  const fontOptions = [
    { label: t.fontTajawal, value: 'var(--font-ar)' },
    { label: t.fontCairo, value: "'Cairo', sans-serif" },
    { label: t.fontInter, value: 'var(--font-en)' },
    { label: t.fontRoboto, value: "'Roboto', sans-serif" },
  ];

  const renderLevelDots = (level: number) => (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? 'bg-current' : 'bg-gray-200 print:bg-gray-100'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 print:block">
      <div className="flex bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border dark:border-gray-700 w-fit mx-auto md:mx-0 print:hidden transition-all duration-300">
        <button onClick={() => setActiveTab('profile')} className={`px-8 py-3 rounded-xl transition-all font-bold ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}`}>{t.profile}</button>
        <button onClick={() => setActiveTab('cv')} className={`px-8 py-3 rounded-xl transition-all font-bold ${activeTab === 'cv' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}`}>{t.cvBuilder}</button>
      </div>

      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-8 text-center transition-colors">
              <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center text-blue-600 dark:text-blue-400 overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <i className="fas fa-user text-5xl"></i>}
              </div>
              <h2 className="text-2xl font-extrabold dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{user.email}</p>
              <button className="bg-primary text-white w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md">
                <i className="fas fa-upload"></i> {t.uploadResume}
              </button>
            </div>
          </aside>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-8">
              <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2 dark:text-white">
                <i className="fas fa-paper-plane text-primary"></i> {t.myApplications}
              </h2>
              <div className="space-y-4">
                {jobs.slice(0, 2).map(job => (
                  <div key={job.id} className="p-4 border dark:border-gray-700 rounded-2xl flex items-center justify-between hover:border-primary transition-all group">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-300 group-hover:text-primary transition-colors">
                        <i className="fas fa-building"></i>
                      </div>
                      <div>
                        <h4 className="font-bold dark:text-white">{job.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{job.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in print:p-0 print:m-0 print:bg-white">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border dark:border-gray-700 p-6 space-y-6 print:hidden transition-all">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <button onClick={() => setIsPreview(!isPreview)} className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-900 transition-all">
                  <i className={`fas ${isPreview ? 'fa-edit' : 'fa-eye'}`}></i> {isPreview ? (lang === 'ar' ? 'العودة للتعديل' : 'Back to Editor') : t.preview}
                </button>
                <button onClick={saveCV} disabled={saving} className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 shadow-md">
                  {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} {t.saveCV}
                </button>
              </div>
              <button onClick={exportPdf} className="bg-green-600 text-white px-8 py-2 rounded-xl font-extrabold flex items-center gap-2 hover:bg-green-700 shadow-md transition-all active:scale-95">
                <i className="fas fa-file-pdf"></i> {t.exportATS}
              </button>
            </div>
          </div>

          {!isPreview ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-8 space-y-12 print:hidden transition-all duration-300">
              <section className="space-y-6">
                <h3 className="text-xl font-bold border-b dark:border-gray-700 pb-2 dark:text-white flex items-center gap-2"><i className="fas fa-id-card text-primary"></i> {lang === 'ar' ? 'المعلومات الأساسية' : 'Primary Information'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" className="w-full border dark:border-gray-600 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} value={cvData.fullName} onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })} />
                  <input type="text" className="w-full border dark:border-gray-600 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" placeholder={lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'} value={cvData.title} onChange={(e) => setCvData({ ...cvData, title: e.target.value })} />
                  <input type="text" className="w-full border dark:border-gray-600 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" placeholder={t.phone} value={cvData.phone} onChange={(e) => setCvData({ ...cvData, phone: e.target.value })} />
                  <input type="email" className="w-full border dark:border-gray-600 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" placeholder={lang === 'ar' ? 'البريد' : 'Email'} value={cvData.email} onChange={(e) => setCvData({ ...cvData, email: e.target.value })} />
                </div>
                <textarea className="w-full border dark:border-gray-600 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24 outline-none" placeholder={t.summary} value={cvData.summary} onChange={(e) => setCvData({ ...cvData, summary: e.target.value })} />
              </section>

              <section className="space-y-6">
                <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2"><h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><i className="fas fa-briefcase text-purple-600"></i> {t.history}</h3><button onClick={addExperience} className="text-primary font-bold hover:underline">+ {t.addExperience}</button></div>
                {cvData.experiences.map((exp, idx) => (
                  <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-750 border dark:border-gray-700 rounded-3xl space-y-4 relative group">
                    <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"><i className="fas fa-trash"></i></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" className="w-full border dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-gray-700" placeholder={t.company} value={exp.company} onChange={(e) => { const n = [...cvData.experiences]; n[idx].company = e.target.value; setCvData({...cvData, experiences: n}); }} />
                      <input type="text" className="w-full border dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-gray-700" placeholder={lang === 'ar' ? 'المسمى' : 'Role'} value={exp.role} onChange={(e) => { const n = [...cvData.experiences]; n[idx].role = e.target.value; setCvData({...cvData, experiences: n}); }} />
                    </div>
                  </div>
                ))}
              </section>
            </div>
          ) : (
             <div 
              style={{ direction: cvData.design.direction, color: cvData.design.textColor, fontSize: `${cvData.design.fontSize}px`, fontFamily: cvData.design.fontFamily, textAlign: cvData.design.direction === 'rtl' ? 'right' : 'left' }}
              className={`mx-auto bg-white text-gray-900 shadow-none min-h-[1122px] w-[794px] print:w-full print:m-0 cv-preview-container border border-gray-100`}
            >
              <div className="p-12 space-y-8">
                  <header className="flex flex-col gap-4 border-b-2 pb-6" style={{ borderColor: cvData.design.accentColor }}>
                    <h1 className="text-4xl font-black uppercase" style={{ color: cvData.design.accentColor }}>{cvData.fullName}</h1>
                    <p className="text-xl font-bold opacity-90">{cvData.title}</p>
                    <div className="flex flex-wrap gap-4 text-sm font-medium opacity-80">
                      <span>{cvData.phone}</span>
                      <span>{cvData.email}</span>
                    </div>
                  </header>
                  <section className="space-y-4">
                    <h2 className="text-lg font-black uppercase tracking-wide border-b" style={{ color: cvData.design.accentColor }}>{t.history}</h2>
                    {cvData.experiences.map((exp, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between font-bold"><h4>{exp.role} @ {exp.company}</h4></div>
                        <p className="opacity-80 text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </section>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
