<<<<<<< HEAD
=======

>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
import React, { useState } from 'react';
import { UserRole, Language } from '../types';
import { translations } from '../translations';
import { supabase } from '../supabase';

interface LoginProps {
  lang: Language;
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ lang, onLogin }) => {
  const t = translations[lang];
  const [step, setStep] = useState<'type' | 'auth'>('auth');
  const [accountType, setAccountType] = useState<UserRole>(UserRole.CANDIDATE);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
=======
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
<<<<<<< HEAD
        const { data, error: signUpError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { 
            data: { 
              full_name: email.split('@')[0],
              role: accountType
            } 
          }
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          // يتم إنشاء البروفايل عبر Trigger في قاعدة البيانات أو يدوياً هنا
          await supabase.from('profiles').upsert({ 
            id: data.user.id, 
            email, 
            name: email.split('@')[0], 
            role: accountType 
          });
          alert(lang === 'ar' ? 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.' : 'Account created! Please check your email.');
        }
=======
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (data.user) {
          // إنشاء البروفايل بالدور المختار
          await supabase.from('profiles').upsert([
            { id: data.user.id, email, name: email.split('@')[0], role: accountType }
          ]);
        }
        alert(lang === 'ar' ? 'تم إنشاء الحساب، يرجى تأكيد البريد الإلكتروني' : 'Account created, please verify email');
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onLogin();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  if (isSignUp && step === 'type') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4 dark:text-white">{t.selectAccountType}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => { setAccountType(UserRole.CANDIDATE); setStep('auth'); }} className="group p-10 bg-white dark:bg-gray-800 border-2 border-transparent hover:border-primary rounded-[3rem] shadow-xl text-center flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary text-4xl group-hover:bg-primary group-hover:text-white transition-all"><i className="fas fa-user-tie"></i></div>
            <h3 className="text-2xl font-black dark:text-white">{t.iAmCandidate}</h3>
          </button>
          <button onClick={() => { setAccountType(UserRole.EMPLOYER); setStep('auth'); }} className="group p-10 bg-white dark:bg-gray-800 border-2 border-transparent hover:border-secondary rounded-[3rem] shadow-xl text-center flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary text-4xl group-hover:bg-secondary group-hover:text-white transition-all"><i className="fas fa-building"></i></div>
            <h3 className="text-2xl font-black dark:text-white">{t.iAmEmployer}</h3>
=======
  if (step === 'type' && isSignUp) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in text-center">
        <h1 className="text-3xl font-black mb-4 dark:text-white">{t.selectAccountType}</h1>
        <p className="text-gray-500 mb-10">{lang === 'ar' ? 'خطوة واحدة تفصلك عن عالم جديد من الفرص' : 'One step away from a world of opportunities'}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => { setAccountType(UserRole.CANDIDATE); setStep('auth'); }}
            className="group p-8 bg-white dark:bg-gray-800 border-2 border-transparent hover:border-primary rounded-3xl shadow-xl transition-all text-right flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-user-tie"></i>
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2">{t.iAmCandidate}</h3>
            <p className="text-sm text-gray-400 text-center">{t.iAmCandidateDesc}</p>
          </button>

          <button 
            onClick={() => { setAccountType(UserRole.EMPLOYER); setStep('auth'); }}
            className="group p-8 bg-white dark:bg-gray-800 border-2 border-transparent hover:border-secondary rounded-3xl shadow-xl transition-all text-right flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary text-3xl mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-building"></i>
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2">{t.iAmEmployer}</h3>
            <p className="text-sm text-gray-400 text-center">{t.iAmEmployerDesc}</p>
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
<<<<<<< HEAD
      <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border dark:border-gray-700 text-center relative overflow-hidden transition-all">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="w-20 h-20 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center text-primary text-3xl shadow-inner"><i className={`fas ${isSignUp ? 'fa-user-plus' : 'fa-fingerprint'}`}></i></div>
        <h1 className="text-3xl font-black mb-6 dark:text-white">{isSignUp ? t.signUp : t.login}</h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold">{error}</div>}

        <form className="space-y-4" onSubmit={handleAuth}>
          <input required type="email" className="app-input" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" className="app-input" placeholder={t.password} value={password} onChange={e => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all transform active:scale-95">
=======
      <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border dark:border-gray-700 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        
        <div className="w-20 h-20 bg-primary/10 rounded-3xl mx-auto mb-6 flex items-center justify-center text-primary text-3xl">
          <i className={`fas ${isSignUp ? 'fa-user-plus' : 'fa-lock'}`}></i>
        </div>
        
        <h1 className="text-3xl font-black mb-2 dark:text-white">
          {isSignUp ? t.signUp : t.login}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
          {isSignUp ? (lang === 'ar' ? `التسجيل كـ ${accountType === UserRole.CANDIDATE ? 'باحث عن عمل' : 'صاحب عمل'}` : `Signing up as ${accountType}`) : t.tagline}
        </p>

        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 animate-shake">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>}

        <div className="space-y-4 mb-8">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border dark:border-gray-600 py-3.5 rounded-2xl font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            {t.continueWithGoogle}
          </button>
          
          <div className="flex items-center gap-4 text-gray-300 dark:text-gray-600 text-xs font-bold py-2">
            <hr className="flex-grow border-gray-200 dark:border-gray-700" />
            <span className="uppercase">{t.orContinueWithEmail}</span>
            <hr className="flex-grow border-gray-200 dark:border-gray-700" />
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleAuth}>
          <div className="space-y-1 text-right">
            <label className="text-xs font-black uppercase text-gray-400 px-1">{t.email}</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                required type="email" 
                className="w-full border dark:border-gray-600 rounded-2xl py-4 pl-12 pr-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="example@mail.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-1 text-right">
            <label className="text-xs font-black uppercase text-gray-400 px-1">{t.password}</label>
            <div className="relative">
              <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                required type="password" 
                className="w-full border dark:border-gray-600 rounded-2xl py-4 pl-12 pr-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-secondary transition-all transform active:scale-95 disabled:opacity-50 mt-4"
          >
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (isSignUp ? t.createAccount : t.login)}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t dark:border-gray-700">
<<<<<<< HEAD
          <button onClick={() => { setIsSignUp(!isSignUp); if(!isSignUp) setStep('type'); }} className="text-primary font-bold hover:underline">
=======
          <button 
            onClick={() => { 
              if (!isSignUp) setStep('type');
              setIsSignUp(!isSignUp); 
              setError(null);
            }}
            className="text-primary font-bold hover:underline transition-all"
          >
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
            {isSignUp ? t.hasAccount : t.noAccount}
          </button>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
