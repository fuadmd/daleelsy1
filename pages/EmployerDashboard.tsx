
import React, { useState } from 'react';
import { Job, Language } from '../types';
import { translations } from '../translations';
import { supabase } from '../supabase';

interface EmployerDashboardProps {
  lang: Language;
  jobs: Job[];
  employerId: string;
  onAdd: (job: Job) => void;
  onUpdate: (job: Job) => void;
  onDelete: (id: string) => void;
}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
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
    </div>
  );
};

export default EmployerDashboard;
