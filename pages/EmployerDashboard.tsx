
<<<<<<< HEAD
import React, { useState, useMemo } from 'react';
import { Job, Language, User } from '../types';
import { translations } from '../translations';
=======
import React, { useState } from 'react';
import { Job, Language } from '../types';
import { translations } from '../translations';
import { supabase } from '../supabase';
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3

interface EmployerDashboardProps {
  lang: Language;
  jobs: Job[];
  employerId: string;
<<<<<<< HEAD
  user: User | null;
=======
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
  onAdd: (job: Job) => void;
  onUpdate: (job: Job) => void;
  onDelete: (id: string) => void;
}

<<<<<<< HEAD
const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ lang, jobs, employerId, user, onAdd, onUpdate, onDelete }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'ads' | 'stats'>('ads');
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // عرض فقط الوظائف التابعة لهذا المستخدم بالتحديد لضمان الخصوصية
  const employerJobs = useMemo(() => {
    return jobs.filter(j => j.employerId === employerId);
  }, [jobs, employerId]);

  // حساب الإحصائيات بناءً على الوظائف الفعلية لصاحب العمل
  const stats = useMemo(() => {
    const now = new Date();
    now.setHours(0,0,0,0);
    const activeJobs = employerJobs.filter(j => j.status === 'active' && new Date(j.postedAt) <= now && new Date(j.expiresAt) >= now);
    return {
      total: employerJobs.length,
      active: activeJobs.length,
      applicants: employerJobs.length * 12 + 5, // قيمة تخيلية للتوضيح
      activePercent: employerJobs.length > 0 ? Math.round((activeJobs.length / employerJobs.length) * 100) : 0
    };
  }, [employerJobs]);

  const [formData, setFormData] = useState<Partial<Job>>({
    title: '', description: '', region: 'damascus', specialty: 'IT',
    company: user?.organization || user?.name || '', 
    companyLogo: user?.avatar || '', 
    postedAt: new Date().toISOString().split('T')[0],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active', externalApplyUrl: ''
  });

  const handleEdit = (job: Job) => {
    setFormData(job);
    setEditingJobId(job.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const useProfileAvatar = () => {
    if (user?.avatar) {
      setFormData({ ...formData, companyLogo: user.avatar });
    } else {
      alert(lang === 'ar' ? 'يرجى رفع صورة لملفك الشخصي أولاً' : 'Please upload a profile photo first');
    }
  };

=======
const GOVERNORATES = [
  'damascus', 'rif_dimashq', 'aleppo', 'homs', 'hama', 'latakia', 'tartus',
  'idlib', 'raqqa', 'deir_ez_zor', 'hasakah', 'daraa', 'suwayda', 'quneitra'
];

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ lang, jobs, employerId, onAdd, onUpdate, onDelete }) => {
  const t = translations[lang];
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const employerJobs = jobs.filter(j => j.employerId === employerId);

  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    description: '',
    region: 'damascus',
    subRegion: '',
    specialty: 'IT',
    company: 'شركة جديدة',
    companyLogo: '',
    postedAt: new Date().toISOString().split('T')[0],
    expiresAt: '',
    status: 'active',
    externalApplyUrl: '',
    attachments: []
  });

>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
<<<<<<< HEAD
    const jobData: Job = {
      ...(formData as Job),
      id: editingJobId || Math.random().toString(36).substr(2, 9),
      employerId: employerId
    };

    if (editingJobId) onUpdate(jobData);
    else onAdd(jobData);

    setShowForm(false);
    setEditingJobId(null);
    setLoading(false);
    setFormData({
      title: '', description: '', region: 'damascus', specialty: 'IT',
      company: user?.organization || user?.name || '', 
      companyLogo: user?.avatar || '', 
      postedAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active', externalApplyUrl: ''
    });
  };

  const governorates = [
    'damascus', 'rif_dimashq', 'aleppo', 'homs', 'hama', 'latakia', 'tartus',
    'idlib', 'raqqa', 'deir_ez_zor', 'hasakah', 'daraa', 'suwayda', 'quneitra'
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-black dark:text-white flex items-center gap-3">
          <i className="fas fa-briefcase text-primary"></i>
          {t.employerPanel}
        </h1>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shadow-inner border dark:border-gray-700">
          <button onClick={() => setActiveTab('ads')} className={`px-6 py-2 rounded-lg font-black text-sm transition-all ${activeTab === 'ads' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500 hover:text-primary'}`}>إعلاناتي</button>
          <button onClick={() => setActiveTab('stats')} className={`px-6 py-2 rounded-lg font-black text-sm transition-all ${activeTab === 'stats' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500 hover:text-primary'}`}>{t.stats}</button>
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border dark:border-gray-700 shadow-sm text-center">
            <h4 className="text-4xl font-black text-primary">{stats.total}</h4>
            <p className="text-xs text-gray-400 font-bold uppercase mt-2 tracking-widest">إجمالي الإعلانات</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border dark:border-gray-700 shadow-sm text-center">
            <h4 className="text-4xl font-black text-green-500">{stats.active}</h4>
            <p className="text-xs text-gray-400 font-bold uppercase mt-2 tracking-widest">وظائف نشطة</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border dark:border-gray-700 shadow-sm text-center">
            <h4 className="text-4xl font-black text-amber-500">{stats.applicants}</h4>
            <p className="text-xs text-gray-400 font-bold uppercase mt-2 tracking-widest">إجمالي المتقدمين</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border dark:border-gray-700 shadow-sm text-center">
            <h4 className="text-4xl font-black text-primary">{stats.activePercent}%</h4>
            <p className="text-xs text-gray-400 font-bold uppercase mt-2 tracking-widest">نسبة الفعالية</p>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black dark:text-white">إدارة الوظائف الحالية</h2>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg transform hover:scale-105 active:scale-95 transition-all"
            >
              {showForm ? 'إلغاء' : t.postJob}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-2xl border dark:border-gray-700 space-y-8 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">عنوان الوظيفة</label>
                  <input required className="app-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="مثال: مدير مبيعات" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">اسم الشركة</label>
                  <input required className="app-input" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">تاريخ البدء</label>
                  <input type="date" required className="app-input" value={formData.postedAt} onChange={e => setFormData({...formData, postedAt: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">تاريخ الانتهاء</label>
                  <input type="date" required className="app-input" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} />
                </div>

                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl border dark:border-gray-600">
                  <span className="text-sm font-bold dark:text-white">حالة الإعلان:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.status === 'active'} onChange={e => setFormData({...formData, status: e.target.checked ? 'active' : 'inactive'})} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className="mr-3 text-sm font-black text-gray-900 dark:text-gray-300">{formData.status === 'active' ? 'مفعل للعامة' : 'معطل ومخفي'}</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">رابط الشعار أو الصورة</label>
                  <div className="flex gap-2">
                    <input className="app-input" placeholder="https://..." value={formData.companyLogo} onChange={e => setFormData({...formData, companyLogo: e.target.value})} />
                    <button type="button" onClick={useProfileAvatar} className="bg-gray-100 dark:bg-gray-700 px-4 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm" title="استخدام صورتي الشخصية">
                        <i className="fas fa-user-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">الوصف والتفاصيل</label>
                <textarea required className="app-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="أدخل متطلبات الوظيفة والمهام..." />
              </div>

              <button disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xl shadow-xl hover:bg-secondary transition-all active:scale-95 transform">
                {loading ? <i className="fas fa-spinner fa-spin"></i> : (editingJobId ? 'حفظ التعديلات' : 'نشر الإعلان الآن')}
              </button>
            </form>
          )}

          <div className="grid gap-4">
            {employerJobs.length > 0 ? (
              employerJobs.map(job => {
                const now = new Date();
                now.setHours(0,0,0,0);
                const isExpired = new Date(job.expiresAt) < now;
                return (
                  <div key={job.id} className={`bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between group transition-all ${isExpired || job.status === 'inactive' ? 'opacity-60 grayscale' : 'hover:border-primary shadow-sm'}`}>
                    <div className="flex items-center gap-4 text-center md:text-right">
                       <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center shrink-0 border dark:border-gray-600">
                          {job.companyLogo ? <img src={job.companyLogo} className="w-full h-full object-contain p-1" alt="" /> : <i className="fas fa-building text-primary"></i>}
                       </div>
                       <div>
                          <h4 className="font-black dark:text-white text-lg leading-tight">{job.title}</h4>
                          <p className="text-xs text-gray-500 font-bold mt-1">{job.postedAt} إلى {job.expiresAt}</p>
                          <span className={`text-[10px] font-black uppercase tracking-tighter block mt-1 ${job.status === 'active' && !isExpired ? 'text-green-500' : 'text-red-500'}`}>
                            {job.status === 'inactive' ? '● معطل يدوياً' : (isExpired ? '● منتهي الصلاحية' : '● نشط حالياً')}
                          </span>
                       </div>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button onClick={() => handleEdit(job)} className="w-10 h-10 flex items-center justify-center text-primary hover:bg-primary/10 rounded-xl transition-colors" title="تعديل"><i className="fas fa-edit"></i></button>
                      <button onClick={() => onDelete(job.id)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-colors" title="حذف"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed dark:border-gray-700">
                <i className="fas fa-folder-open text-3xl text-gray-300 mb-4"></i>
                <p className="text-gray-400 font-bold">لم تقم بنشر أي إعلانات بعد.</p>
              </div>
            )}
          </div>
        </div>
      )}
=======
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        ...formData,
        employer_id: employerId
      }])
      .select();

    if (!error) {
      onAdd(data[0] as Job);
      setShowForm(false);
      setFormData({
        title: '', description: '', region: 'damascus', subRegion: '', specialty: 'IT',
        company: '', companyLogo: '', postedAt: new Date().toISOString().split('T')[0],
        expiresAt: '', status: 'active', externalApplyUrl: '', attachments: []
      });
    } else {
      alert(lang === 'ar' ? 'خطأ في النشر' : 'Error posting');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) onDelete(id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold dark:text-white">{t.employerPanel}</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 flex items-center gap-2 shadow-xl"
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? (lang === 'ar' ? 'إلغاء' : 'Cancel') : t.postJob}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border dark:border-gray-700 space-y-8 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required className="w-full border dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700 dark:text-white" placeholder={lang === 'ar' ? 'عنوان الوظيفة' : 'Job Title'} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input required className="w-full border dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700 dark:text-white" placeholder={lang === 'ar' ? 'اسم الشركة' : 'Company Name'} value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select className="w-full border dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700 dark:text-white" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
              {GOVERNORATES.map(gov => <option key={gov} value={gov}>{t[gov as keyof typeof t]}</option>)}
            </select>
            <input type="date" required className="w-full border dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700 dark:text-white" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} />
          </div>
          <textarea required rows={5} className="w-full border dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700 dark:text-white" placeholder={lang === 'ar' ? 'وصف الوظيفة' : 'Job Description'} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <button disabled={loading} className="bg-primary text-white w-full py-5 rounded-2xl font-black text-xl shadow-2xl disabled:opacity-50">
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (lang === 'ar' ? 'نشر الإعلان الآن' : 'Publish Ad Now')}
          </button>
        </form>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="divide-y dark:divide-gray-700">
          {employerJobs.map(job => (
            <div key={job.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-all">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary"><i className="fas fa-briefcase text-2xl"></i></div>
                <div>
                  <h4 className="font-bold text-lg dark:text-white">{job.title}</h4>
                  <p className="text-sm text-gray-500">{t[job.region as keyof typeof t]} • {job.expiresAt}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(job.id)} className="p-3 text-red-400 hover:text-red-600"><i className="fas fa-trash-alt"></i></button>
            </div>
          ))}
        </div>
      </div>
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
    </div>
  );
};

export default EmployerDashboard;
