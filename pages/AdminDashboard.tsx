
import React, { useState, useMemo } from 'react';
import { UserRole, Language, AppSettings, EmployeeProfile, Job } from '../types';
import { translations } from '../translations';

interface AdminDashboardProps {
  lang: Language;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  jobs: Job[];
  onAddJob: (job: Job) => void;
  onUpdateJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, settings, setSettings, jobs, onAddJob, onUpdateJob, onDeleteJob }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'ads' | 'settings'>('stats');
  const [draftSettings, setDraftSettings] = useState<AppSettings>(settings);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    const now = new Date();
    now.setHours(0,0,0,0);
    return {
      total: jobs.length,
      active: jobs.filter(j => j.status === 'active' && new Date(j.postedAt) <= now && new Date(j.expiresAt) >= now).length,
      expired: jobs.filter(j => new Date(j.expiresAt) < now).length,
      inactive: jobs.filter(j => j.status === 'inactive').length
    };
  }, [jobs]);

  const [jobFormData, setJobFormData] = useState<Partial<Job>>({
    title: '', company: '', companyLogo: '', description: '', region: 'damascus', subRegion: '', specialty: 'IT',
    postedAt: new Date().toISOString().split('T')[0], 
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    status: 'active', externalApplyUrl: ''
  });

  const [mockUsers, setMockUsers] = useState([
    { id: '1', name: 'أحمد علي', email: 'ahmad@example.com', role: UserRole.CANDIDATE },
    { id: '2', name: 'سارة خالد', email: 'sara@example.com', role: UserRole.EMPLOYER },
    { id: '3', name: 'جمال حسن', email: 'jamal@example.com', role: UserRole.LIMITED_ADMIN },
    { id: '4', name: 'رؤى يوسف', email: 'roua@example.com', role: UserRole.SUPER_ADMIN },
  ]);

  const handlePromote = (id: string, newRole: UserRole) => {
    setMockUsers(mockUsers.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const handleApplySettings = () => {
    setSettings(draftSettings);
    localStorage.setItem('daleelsy_settings', JSON.stringify(draftSettings));
    alert(lang === 'ar' ? 'تم حفظ كافة الإعدادات بنجاح!' : 'All settings saved successfully!');
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const jobData: Job = {
      ...(jobFormData as Job),
      id: editingJobId || Math.random().toString(36).substr(2, 9),
      employerId: 'admin-action'
    };
    if (editingJobId) onUpdateJob(jobData);
    else onAddJob(jobData);
    setLoading(false);
    setShowJobForm(false);
    setEditingJobId(null);
  };

  const handleEditJob = (job: Job) => {
    setJobFormData(job);
    setEditingJobId(job.id);
    setShowJobForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-sm border dark:border-gray-700 p-8 print:hidden transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b dark:border-gray-700 pb-6 gap-4">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 dark:text-white">
          <i className="fas fa-shield-alt text-primary"></i>
          {t.adminPanel}
        </h1>
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl overflow-x-auto max-w-full shadow-inner">
          {['stats', 'users', 'ads', 'settings'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)} 
              className={`px-6 py-2 rounded-lg transition-all whitespace-nowrap font-bold ${activeTab === tab ? 'bg-white dark:bg-gray-600 shadow text-primary' : 'text-gray-500 hover:text-primary dark:text-gray-400'}`}
            >
              {tab === 'stats' ? t.stats : tab === 'users' ? t.users : tab === 'ads' ? (lang === 'ar' ? 'الإعلانات' : 'Ads') : t.settings}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          <div className="bg-primary/5 p-8 rounded-3xl text-primary border border-primary/10 shadow-sm">
            <h4 className="text-xs font-black uppercase mb-2 opacity-60">إجمالي الإعلانات</h4>
            <div className="text-4xl font-black">{stats.total}</div>
          </div>
          <div className="bg-green-50 p-8 rounded-3xl text-green-600 border border-green-100 shadow-sm">
            <h4 className="text-xs font-black uppercase mb-2 opacity-60">نشطة حالياً</h4>
            <div className="text-4xl font-black">{stats.active}</div>
          </div>
          <div className="bg-red-50 p-8 rounded-3xl text-red-600 border border-red-100 shadow-sm">
            <h4 className="text-xs font-black uppercase mb-2 opacity-60">منتهية</h4>
            <div className="text-4xl font-black">{stats.expired}</div>
          </div>
          <div className="bg-gray-100 p-8 rounded-3xl text-gray-500 border border-gray-200 shadow-sm">
            <h4 className="text-xs font-black uppercase mb-2 opacity-60">غير مفعلة</h4>
            <div className="text-4xl font-black">{stats.inactive}</div>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black dark:text-white">{lang === 'ar' ? 'إدارة الإعلانات' : 'Manage Ads'}</h2>
            <button onClick={() => { setShowJobForm(!showJobForm); if(!showJobForm) setEditingJobId(null); }} className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
              <i className={`fas ${showJobForm ? 'fa-times' : 'fa-plus'}`}></i>
              {showJobForm ? (lang === 'ar' ? 'إلغاء' : 'Cancel') : t.postJob}
            </button>
          </div>

          {showJobForm && (
            <form onSubmit={handleJobSubmit} className="bg-gray-50 dark:bg-gray-900/40 p-8 rounded-[2rem] border dark:border-gray-700 space-y-6 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required className="app-input" placeholder="عنوان الوظيفة" value={jobFormData.title} onChange={e => setJobFormData({...jobFormData, title: e.target.value})} />
                <input required className="app-input" placeholder="اسم الشركة" value={jobFormData.company} onChange={e => setJobFormData({...jobFormData, company: e.target.value})} />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 mr-2">تاريخ البدء</label>
                  <input type="date" required className="app-input" value={jobFormData.postedAt} onChange={e => setJobFormData({...jobFormData, postedAt: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 mr-2">تاريخ الانتهاء</label>
                  <input type="date" required className="app-input" value={jobFormData.expiresAt} onChange={e => setJobFormData({...jobFormData, expiresAt: e.target.value})} />
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700">
                  <span className="text-sm font-bold dark:text-white">حالة التفعيل:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={jobFormData.status === 'active'} onChange={e => setJobFormData({...jobFormData, status: e.target.checked ? 'active' : 'inactive'})} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    <span className="mr-3 text-sm font-black text-gray-900 dark:text-gray-300">{jobFormData.status === 'active' ? 'مفعل' : 'غير مفعل'}</span>
                  </label>
                </div>
              </div>
              <textarea required className="app-textarea" placeholder="وصف الوظيفة" value={jobFormData.description} onChange={e => setJobFormData({...jobFormData, description: e.target.value})} />
              <button disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xl shadow-xl">
                {editingJobId ? 'تحديث الإعلان' : 'نشر الإعلان'}
              </button>
            </form>
          )}

          <div className="overflow-x-auto rounded-[2rem] border dark:border-gray-700 bg-white dark:bg-gray-800">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-400">
                <tr>
                  <th className="p-4 font-black">الإعلان</th>
                  <th className="p-4 font-black">الفترة</th>
                  <th className="p-4 font-black text-center">الحالة</th>
                  <th className="p-4 font-black text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} className="border-b dark:border-gray-700 hover:bg-gray-50">
                    <td className="p-4 font-bold dark:text-white">{job.title}</td>
                    <td className="p-4 text-xs text-gray-500">{job.postedAt} - {job.expiresAt}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${job.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {job.status === 'active' ? 'مفعل' : 'غير مفعل'}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => handleEditJob(job)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><i className="fas fa-edit"></i></button>
                      <button onClick={() => onDeleteJob(job.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="overflow-x-auto animate-fade-in bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-400">
              <tr>
                <th className="p-4 font-black">المستخدم</th>
                <th className="p-4 font-black">الصلاحية</th>
                <th className="p-4 font-black">تغيير الصلاحية</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id} className="border-b dark:border-gray-700">
                  <td className="p-4">
                    <div className="font-bold dark:text-white">{u.name}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </td>
                  <td className="p-4"><span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-bold dark:text-gray-200">{u.role}</span></td>
                  <td className="p-4">
                    <select className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-xl p-2 text-xs font-bold outline-none dark:text-white" onChange={(e) => handlePromote(u.id, e.target.value as UserRole)} value={u.role}>
                      <option value={UserRole.CANDIDATE}>{t.candidate}</option>
                      <option value={UserRole.EMPLOYER}>{t.employer}</option>
                      <option value={UserRole.LIMITED_ADMIN}>{t.limitedAdmin}</option>
                      <option value={UserRole.SUPER_ADMIN}>{t.superAdmin}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-10 animate-fade-in">
          {/* Colors Group */}
          <section className="space-y-4">
            <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
              <i className="fas fa-palette text-primary"></i> ألوان الهوية والثيم
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-900/40 p-6 rounded-3xl border dark:border-gray-700">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">أساسي (نهار)</label>
                <input type="color" className="w-full h-10 rounded-xl cursor-pointer" value={draftSettings.lightPrimaryColor} onChange={e => setDraftSettings({...draftSettings, lightPrimaryColor: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">ثانوي (نهار)</label>
                <input type="color" className="w-full h-10 rounded-xl cursor-pointer" value={draftSettings.lightSecondaryColor} onChange={e => setDraftSettings({...draftSettings, lightSecondaryColor: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">أساسي (ليل)</label>
                <input type="color" className="w-full h-10 rounded-xl cursor-pointer" value={draftSettings.darkPrimaryColor} onChange={e => setDraftSettings({...draftSettings, darkPrimaryColor: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">ثانوي (ليل)</label>
                <input type="color" className="w-full h-10 rounded-xl cursor-pointer" value={draftSettings.darkSecondaryColor} onChange={e => setDraftSettings({...draftSettings, darkSecondaryColor: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Hero Section Group */}
          <section className="space-y-4">
            <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
              <i className="fas fa-image text-primary"></i> واجهة الهيرو الرئيسية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/40 p-6 rounded-3xl border dark:border-gray-700">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">العنوان (عربي)</label>
                <input className="app-input" value={draftSettings.heroTitleAr} onChange={e => setDraftSettings({...draftSettings, heroTitleAr: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">العنوان (English)</label>
                <input className="app-input" value={draftSettings.heroTitleEn} onChange={e => setDraftSettings({...draftSettings, heroTitleEn: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">الوصف</label>
                <textarea className="app-textarea h-20 min-h-0" value={draftSettings.heroSubtitleAr} onChange={e => setDraftSettings({...draftSettings, heroSubtitleAr: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">لون الخلفية</label>
                <input type="color" className="w-full h-10 rounded-xl cursor-pointer" value={draftSettings.heroBgColor} onChange={e => setDraftSettings({...draftSettings, heroBgColor: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">رابط صورة الهيرو</label>
                <input className="app-input" value={draftSettings.heroImage} onChange={e => setDraftSettings({...draftSettings, heroImage: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Background Pattern Group */}
          <section className="space-y-4">
            <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
              <i className="fas fa-th text-primary"></i> نمط خلفية الموقع (Global Pattern)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900/40 p-6 rounded-3xl border dark:border-gray-700">
              <div className="md:col-span-1 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">رابط الـ Pattern</label>
                <input className="app-input" value={draftSettings.bgPatternUrl} onChange={e => setDraftSettings({...draftSettings, bgPatternUrl: e.target.value})} placeholder="URL..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">المقاس (%)</label>
                <input type="number" className="app-input" value={draftSettings.bgPatternScale} onChange={e => setDraftSettings({...draftSettings, bgPatternScale: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">الشفافية (0-1)</label>
                <input type="number" step="0.1" className="app-input" value={draftSettings.bgPatternOpacity} onChange={e => setDraftSettings({...draftSettings, bgPatternOpacity: parseFloat(e.target.value)})} />
              </div>
            </div>
          </section>

          {/* Texts & System Group */}
          <section className="space-y-4">
            <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
              <i className="fas fa-cog text-primary"></i> نصوص التذييل والسلايدر
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/40 p-6 rounded-3xl border dark:border-gray-700">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">تذييل الموقع (عربي)</label>
                <input className="app-input" value={draftSettings.footerTextAr} onChange={e => setDraftSettings({...draftSettings, footerTextAr: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">تذييل الموقع (English)</label>
                <input className="app-input" value={draftSettings.footerTextEn} onChange={e => setDraftSettings({...draftSettings, footerTextEn: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">عنوان شريط الإعلانات</label>
                <input className="app-input" value={draftSettings.adSliderTitleAr} onChange={e => setDraftSettings({...draftSettings, adSliderTitleAr: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">بريد إشعارات المسؤول</label>
                <input className="app-input" value={draftSettings.adminNotificationEmails} onChange={e => setDraftSettings({...draftSettings, adminNotificationEmails: e.target.value})} placeholder="admin@example.com" />
              </div>
            </div>
          </section>

          <button onClick={handleApplySettings} className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-secondary transition-all transform active:scale-95 flex items-center justify-center gap-3">
            <i className="fas fa-save"></i>
            حفظ وتطبيق كافة الإعدادات
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
