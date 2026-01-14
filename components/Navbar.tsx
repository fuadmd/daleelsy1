
<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
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
<<<<<<< HEAD
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b dark:border-gray-700 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="text-2xl font-bold text-primary cursor-pointer flex items-center gap-2 group"
          onClick={() => setCurrentPage('home')}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <i className="fas fa-briefcase"></i>
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t.appName}
          </span>
        </div>

        {/* Dynamic Navigation Links Based on Role */}
        <div className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`text-sm font-bold transition-all ${currentPage === 'home' ? 'text-primary' : 'text-gray-500 hover:text-primary dark:text-gray-400'}`}
=======

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
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
          >
            {t.home}
          </button>
          
<<<<<<< HEAD
          {(currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.LIMITED_ADMIN) && (
            <button 
              onClick={() => setCurrentPage('admin')}
              className={`text-sm font-bold transition-all ${currentPage === 'admin' ? 'text-primary underline decoration-2 underline-offset-8' : 'text-gray-500 hover:text-primary dark:text-gray-400'}`}
=======
          {currentUser?.role === UserRole.SUPER_ADMIN && (
            <button 
              onClick={() => setCurrentPage('admin')}
              className={`${currentPage === 'admin' ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-300'} hover:text-secondary`}
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
            >
              {t.adminPanel}
            </button>
          )}

          {currentUser?.role === UserRole.EMPLOYER && (
            <button 
              onClick={() => setCurrentPage('employer')}
<<<<<<< HEAD
              className={`text-sm font-bold transition-all ${currentPage === 'employer' ? 'text-primary underline decoration-2 underline-offset-8' : 'text-gray-500 hover:text-primary dark:text-gray-400'}`}
=======
              className={`${currentPage === 'employer' ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-300'} hover:text-secondary`}
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
            >
              {t.employerPanel}
            </button>
          )}
<<<<<<< HEAD

          {currentUser?.role === UserRole.CANDIDATE && (
            <button 
              onClick={() => setCurrentPage('user')}
              className={`text-sm font-bold transition-all ${currentPage === 'user' ? 'text-primary underline decoration-2 underline-offset-8' : 'text-gray-500 hover:text-primary dark:text-gray-400'}`}
            >
              {t.dashboard}
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center border dark:border-gray-600"
=======
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 border dark:border-gray-600 transition-all"
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
          >
            <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>

          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
<<<<<<< HEAD
            className="px-3 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-black border dark:border-gray-600 dark:text-gray-200"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
=======
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm font-bold border dark:border-gray-600 dark:text-gray-300 transition-all"
          >
            <i className="fas fa-globe text-primary"></i>
            {lang === 'ar' ? 'EN' : 'ع'}
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
          </button>

          {!currentUser ? (
            <button 
              onClick={() => setCurrentPage('login')}
<<<<<<< HEAD
              className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>{t.login}</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-1.5 pr-4 rounded-2xl border dark:border-gray-600 hover:border-primary transition-all group"
              >
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.welcome}</span>
                  <span className="text-sm font-black dark:text-white truncate max-w-[120px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
=======
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
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {showDropdown && (
<<<<<<< HEAD
                <div className="absolute top-full mt-2 left-0 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 py-2 animate-slide-down">
                  <div className="px-4 py-3 border-b dark:border-gray-700 mb-2">
                    <p className="text-xs text-gray-400 font-bold">{currentUser.email}</p>
                    <p className="text-xs text-primary font-black mt-1 uppercase">{t[currentUser.role.toLowerCase() as keyof typeof t] || currentUser.role}</p>
                  </div>
                  
                  <button 
                    onClick={() => { 
                      if (currentUser.role === UserRole.CANDIDATE) setCurrentPage('user');
                      else if (currentUser.role === UserRole.EMPLOYER) setCurrentPage('employer');
                      else setCurrentPage('admin');
                      setShowDropdown(false); 
                    }}
                    className="w-full text-right px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white flex items-center gap-3 transition-colors"
                  >
                    <i className="fas fa-user-circle text-primary opacity-70"></i>
                    <span className="font-bold">{t.dashboard}</span>
                  </button>
                  
                  <button 
                    onClick={() => { onLogout(); setShowDropdown(false); }}
                    className="w-full text-right px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 flex items-center gap-3 transition-colors"
                  >
                    <i className="fas fa-power-off opacity-70"></i>
                    <span className="font-bold">{t.logout}</span>
=======
                <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 py-2 animate-slide-down">
                  <button onClick={() => { setCurrentPage('user'); setShowDropdown(false); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white flex items-center gap-2">
                    <i className="fas fa-id-badge text-primary w-5"></i> {t.profile}
                  </button>
                  <hr className="my-1 dark:border-gray-700" />
                  <button onClick={onLogout} className="w-full text-right px-4 py-3 hover:bg-red-50 text-red-500 flex items-center gap-2">
                    <i className="fas fa-sign-out-alt w-5"></i> {t.logout}
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
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
