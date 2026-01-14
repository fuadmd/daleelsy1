
import React, { useState } from 'react';
import { User, UserRole, Language, Theme } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  currentUser: User | null;
  onLogout: () => void;
  setCurrentPage: (p: any) => void;
  currentPage: string;
  theme: Theme;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, currentUser, onLogout, setCurrentPage, currentPage, theme, toggleTheme }) => {
  const t = translations[lang];
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="text-2xl font-bold text-primary cursor-pointer flex items-center gap-2"
          onClick={() => setCurrentPage('home')}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-briefcase"></i>
          </div>
          <span className="hidden sm:inline">{t.appName}</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`${currentPage === 'home' ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-300'} hover:text-secondary transition-all`}
          >
            {t.home}
          </button>
          
          {currentUser?.role === UserRole.SUPER_ADMIN && (
            <button 
              onClick={() => setCurrentPage('admin')}
              className={`${currentPage === 'admin' ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-300'} hover:text-secondary`}
            >
              {t.adminPanel}
            </button>
          )}

          {currentUser?.role === UserRole.EMPLOYER && (
            <button 
              onClick={() => setCurrentPage('employer')}
              className={`${currentPage === 'employer' ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-300'} hover:text-secondary`}
            >
              {t.employerPanel}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 border dark:border-gray-600 transition-all"
          >
            <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>

          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm font-bold border dark:border-gray-600 dark:text-gray-300 transition-all"
          >
            <i className="fas fa-globe text-primary"></i>
            {lang === 'ar' ? 'EN' : 'ع'}
          </button>

          {!currentUser ? (
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-secondary transition-all shadow-md font-bold flex items-center gap-2"
            >
              <i className="fas fa-user-circle"></i>
              {t.login}
            </button>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-2 pr-4 rounded-xl border dark:border-gray-600 hover:border-primary transition-all"
              >
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs text-gray-400 font-medium">{t.welcome}</span>
                  <span className="text-sm font-black dark:text-white truncate max-w-[100px]">{currentUser.name}</span>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {showDropdown && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 py-2 animate-slide-down">
                  <button onClick={() => { setCurrentPage('user'); setShowDropdown(false); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white flex items-center gap-2">
                    <i className="fas fa-id-badge text-primary w-5"></i> {t.profile}
                  </button>
                  <hr className="my-1 dark:border-gray-700" />
                  <button onClick={onLogout} className="w-full text-right px-4 py-3 hover:bg-red-50 text-red-500 flex items-center gap-2">
                    <i className="fas fa-sign-out-alt w-5"></i> {t.logout}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
