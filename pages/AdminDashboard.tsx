
import React, { useState } from 'react';
import { UserRole, Language, AppSettings, EmployeeProfile } from '../types';
import { translations } from '../translations';

interface AdminDashboardProps {
  lang: Language;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

const MOCK_EMPLOYEES: EmployeeProfile[] = [
  { id: '1', name: 'سامر السوري', specialty: 'IT', skills: ['React', 'Node.js', 'SQL'], jobHistory: ['Senior Dev @ Google', 'Lead @ Amazon'], joinedDate: '2022-01-15' },
  { id: '2', name: 'لينا محمد', specialty: 'Medical', skills: ['Surgery', 'ER', 'Diagnosis'], jobHistory: ['Surgeon @ Damascus Hospital'], joinedDate: '2023-05-10' },
  { id: '3', name: 'عمر القاسم', specialty: 'Engineering', skills: ['AutoCAD', 'Structural Design'], jobHistory: ['Project Manager @ Omran'], joinedDate: '2021-11-20' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, settings, setSettings }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'employees' | 'settings'>('stats');
  const [draftSettings, setDraftSettings] = useState<AppSettings>(settings);

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
    alert(lang === 'ar' ? 'تم حفظ الإعدادات وتطبيق التخصيص بنجاح!' : 'Settings saved and customizations applied successfully!');
  };

  const applyDarkModePreset = () => {
    setDraftSettings({
      ...draftSettings,
      darkPrimaryColor: '#60a5fa',
      darkSecondaryColor: '#1d4ed8',
      heroBgColor: '#1e293b',
    });
  };

  const applyLightModePreset = () => {
    setDraftSettings({
      ...draftSettings,
      lightPrimaryColor: '#3b82f6',
      lightSecondaryColor: '#1e40af',
      heroBgColor: '#2563eb',
    });
  };

  const exportEmployeesToExcel = () => {
    const headers = ["ID", "Name", "Specialty", "Skills", "History", "Joined Date"];
    const rows = MOCK_EMPLOYEES.map(e => [
      e.id, 
      e.name, 
      e.specialty, 
      `"${e.skills.join("; ")}"`, 
      `"${e.jobHistory.join("; ")}"`, 
      e.joinedDate
    ]);
    const csvContent = headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `daleelsy_employees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-sm border dark:border-gray-700 p-8 print:hidden transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b dark:border-gray-700 pb-6 gap-4">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 dark:text-white">
          <i className="fas fa-shield-alt text-primary"></i>
          {t.adminPanel}
        </h1>
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl overflow-x-auto max-w-full shadow-inner">
          {['stats', 'users', 'employees', 'settings'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)} 
              className={`px-4 md:px-6 py-2 rounded-lg transition-all whitespace-nowrap font-bold ${activeTab === tab ? 'bg-white dark:bg-gray-600 shadow text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-secondary'}`}
            >
              {t[tab as keyof typeof t] || tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-primary/5 dark:bg-primary/20 p-8 rounded-3xl text-primary dark:text-blue-100 border border-primary/10 dark:border-gray-700 shadow-sm transition-colors">
            <h4 className="text-sm font-bold uppercase mb-2 opacity-70">إجمالي الوظائف</h4>
            <div className="text-4xl font-extrabold">1,284</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-3xl text-green-800 dark:text-green-100 border border-green-100 dark:border-green-800 shadow-sm transition-colors">
            <h4 className="text-sm font-bold uppercase mb-2 opacity-70">إجمالي الباحثين</h4>
            <div className="text-4xl font-extrabold">12,450</div>
          </div>
          <div className="bg-secondary/5 dark:bg-secondary/20 p-8 rounded-3xl text-secondary dark:text-blue-100 border border-secondary/10 dark:border-gray-700 shadow-sm transition-colors">
            <h4 className="text-sm font-bold uppercase mb-2 opacity-70">أصحاب العمل</h4>
            <div className="text-4xl font-extrabold">432</div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="overflow-x-auto animate-fade-in">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b dark:border-gray-700 text-gray-400">
                <th className="py-4 font-bold">{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                <th className="py-4 font-bold">{lang === 'ar' ? 'البريد' : 'Email'}</th>
                <th className="py-4 font-bold">{t.role}</th>
                <th className="py-4 font-bold">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="py-4 font-bold dark:text-gray-100">{u.name}</td>
                  <td className="py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="py-4"><span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-bold dark:text-gray-200">{t[u.role.toLowerCase() as keyof typeof t] || u.role}</span></td>
                  <td className="py-4">
                    <select className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded p-2 text-sm outline-none dark:text-white transition-colors" onChange={(e) => handlePromote(u.id, e.target.value as UserRole)} value={u.role}>
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

      {activeTab === 'employees' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <i className="fas fa-users text-secondary"></i>
              {t.employeeDb}
            </h3>
            <button 
              onClick={exportEmployeesToExcel}
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-green-700 shadow-md transition-all active:scale-95"
            >
              <i className="fas fa-file-excel"></i>
              {t.exportExcel}
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl border dark:border-gray-700 bg-white dark:bg-gray-900/20">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700 text-gray-400">
                  <th className="py-4 px-4 font-bold">{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                  <th className="py-4 px-4 font-bold">{t.specialty}</th>
                  <th className="py-4 px-4 font-bold">{t.skills}</th>
                  <th className="py-4 px-4 font-bold">{t.history}</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_EMPLOYEES.map(emp => (
                  <tr key={emp.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="py-4 px-4 font-bold dark:text-white">{emp.name}</td>
                    <td className="py-4 px-4 dark:text-gray-300">{emp.specialty}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {emp.skills.map(s => <span key={s} className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">{s}</span>)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500 dark:text-gray-400">
                      {emp.jobHistory.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-12 animate-fade-in">
          {/* Quick Presets */}
          <div className="max-w-4xl space-y-4 bg-gray-50 dark:bg-gray-900/40 p-6 rounded-3xl border dark:border-gray-700">
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <i className="fas fa-magic text-yellow-500"></i>
              {t.presets}
            </h3>
            <div className="flex flex-wrap gap-4">
              <button onClick={applyDarkModePreset} className="flex items-center gap-3 bg-gray-800 text-white px-6 py-3 rounded-2xl hover:bg-gray-900 transition-all shadow-lg border border-gray-700">
                <i className="fas fa-moon text-blue-400"></i>
                <span className="font-bold">{t.setDarkMode}</span>
              </button>
              <button onClick={applyLightModePreset} className="flex items-center gap-3 bg-white text-gray-800 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all shadow-lg border border-gray-200">
                <i className="fas fa-sun text-yellow-500"></i>
                <span className="font-bold">{t.setLightMode}</span>
              </button>
            </div>
          </div>

          {/* Light Mode Colors */}
          <div className="max-w-4xl space-y-8 p-6 bg-orange-50/20 dark:bg-orange-900/5 rounded-3xl border border-orange-100 dark:border-orange-900/20">
            <h3 className="text-xl font-bold border-b border-orange-200 dark:border-orange-800/30 pb-3 dark:text-white flex items-center gap-2">
              <i className="fas fa-sun text-orange-500"></i>
              {t.lightColors}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{t.primary}</label>
                <div className="flex gap-4">
                  <input type="color" value={draftSettings.lightPrimaryColor} onChange={(e) => setDraftSettings({...draftSettings, lightPrimaryColor: e.target.value})} className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white dark:border-gray-600 shadow-lg" />
                  <span className="self-center font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border dark:border-gray-600">{draftSettings.lightPrimaryColor}</span>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{t.secondary}</label>
                <div className="flex gap-4">
                  <input type="color" value={draftSettings.lightSecondaryColor} onChange={(e) => setDraftSettings({...draftSettings, lightSecondaryColor: e.target.value})} className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white dark:border-gray-600 shadow-lg" />
                  <span className="self-center font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border dark:border-gray-600">{draftSettings.lightSecondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dark Mode Colors */}
          <div className="max-w-4xl space-y-8 p-6 bg-blue-50/20 dark:bg-blue-900/5 rounded-3xl border border-blue-100 dark:border-blue-900/20">
            <h3 className="text-xl font-bold border-b border-blue-200 dark:border-blue-800/30 pb-3 dark:text-white flex items-center gap-2">
              <i className="fas fa-moon text-blue-500"></i>
              {t.darkColors}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{t.primary}</label>
                <div className="flex gap-4">
                  <input type="color" value={draftSettings.darkPrimaryColor} onChange={(e) => setDraftSettings({...draftSettings, darkPrimaryColor: e.target.value})} className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white dark:border-gray-600 shadow-lg" />
                  <span className="self-center font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border dark:border-gray-600">{draftSettings.darkPrimaryColor}</span>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{t.secondary}</label>
                <div className="flex gap-4">
                  <input type="color" value={draftSettings.darkSecondaryColor} onChange={(e) => setDraftSettings({...draftSettings, darkSecondaryColor: e.target.value})} className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white dark:border-gray-600 shadow-lg" />
                  <span className="self-center font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border dark:border-gray-600">{draftSettings.darkSecondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Texts Customization */}
          <div className="max-w-4xl space-y-12">
            <h3 className="text-xl font-bold border-b dark:border-gray-700 pb-3 dark:text-white flex items-center gap-2">
              <i className="fas fa-font text-purple-500"></i>
              {lang === 'ar' ? 'تخصيص كافة نصوص الموقع' : 'Customize App Texts'}
            </h3>

            {/* Ad Slider */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-primary flex items-center gap-2"><i className="fas fa-images"></i> {t.customizeAdText}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">العربية</label>
                  <input type="text" className="w-full border dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 dark:text-white" value={draftSettings.adSliderTitleAr} onChange={e => setDraftSettings({...draftSettings, adSliderTitleAr: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">English</label>
                  <input type="text" className="w-full border dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 dark:text-white" value={draftSettings.adSliderTitleEn} onChange={e => setDraftSettings({...draftSettings, adSliderTitleEn: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-primary flex items-center gap-2"><i className="fas fa-star"></i> {t.customizeHero}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">{t.heroTitle} (AR)</label>
                    <input type="text" className="w-full border dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 dark:text-white" value={draftSettings.heroTitleAr} onChange={e => setDraftSettings({...draftSettings, heroTitleAr: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">{t.heroSubtitle} (AR)</label>
                    <textarea className="w-full border dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 dark:text-white" rows={2} value={draftSettings.heroSubtitleAr} onChange={e => setDraftSettings({...draftSettings, heroSubtitleAr: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">{t.heroTitle} (EN)</label>
                    <input type="text" className="w-full border dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 dark:text-white" value={draftSettings.heroTitleEn} onChange={e => setDraftSettings({...draftSettings, heroTitleEn: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">{t.heroSubtitle} (EN)</label>
                    <textarea className="w-full border dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 dark:text-white" rows={2} value={draftSettings.heroSubtitleEn} onChange={e => setDraftSettings({...draftSettings, heroSubtitleEn: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">{t.heroBgColor}</label>
                  <input type="color" className="w-full h-12 rounded cursor-pointer" value={draftSettings.heroBgColor} onChange={e => setDraftSettings({...draftSettings, heroBgColor: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">{t.heroImage}</label>
                  <input type="text" className="w-full border dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 dark:text-white" placeholder="https://..." value={draftSettings.heroImage} onChange={e => setDraftSettings({...draftSettings, heroImage: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-primary flex items-center gap-2"><i className="fas fa-shoe-prints"></i> {t.customizeFooter}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">{t.footerText} (AR)</label>
                  <input type="text" className="w-full border dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 dark:text-white" value={draftSettings.footerTextAr} onChange={e => setDraftSettings({...draftSettings, footerTextAr: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">{t.footerText} (EN)</label>
                  <input type="text" className="w-full border dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-700 dark:text-white" value={draftSettings.footerTextEn} onChange={e => setDraftSettings({...draftSettings, footerTextEn: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced / Pattern */}
          <div className="max-w-4xl space-y-8 p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border dark:border-gray-700">
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <i className="fas fa-layer-group text-blue-400"></i>
              {lang === 'ar' ? 'إعدادات النمط والترقيات' : 'Advanced & Patterns'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">{t.patternUrl}</label>
                <input type="text" className="w-full border dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white text-xs" value={draftSettings.bgPatternUrl} onChange={e => setDraftSettings({...draftSettings, bgPatternUrl: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">{t.patternScale}</label>
                <input type="number" className="w-full border dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 dark:text-white text-xs" value={draftSettings.bgPatternScale} onChange={e => setDraftSettings({...draftSettings, bgPatternScale: parseInt(e.target.value)})} />
              </div>
               <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">{t.patternOpacity} ({draftSettings.bgPatternOpacity})</label>
                <input type="range" min="0" max="1" step="0.1" className="w-full" value={draftSettings.bgPatternOpacity} onChange={e => setDraftSettings({...draftSettings, bgPatternOpacity: parseFloat(e.target.value)})} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 border-t dark:border-gray-700 flex gap-4">
            <button onClick={handleApplySettings} className="bg-primary text-white px-16 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-secondary transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-3">
              <i className="fas fa-save"></i>
              {t.save}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
