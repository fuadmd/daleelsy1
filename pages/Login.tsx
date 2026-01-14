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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
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
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border dark:border-gray-700 text-center relative overflow-hidden transition-all">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="w-20 h-20 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center text-primary text-3xl shadow-inner"><i className={`fas ${isSignUp ? 'fa-user-plus' : 'fa-fingerprint'}`}></i></div>
        <h1 className="text-3xl font-black mb-6 dark:text-white">{isSignUp ? t.signUp : t.login}</h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold">{error}</div>}

        <form className="space-y-4" onSubmit={handleAuth}>
          <input required type="email" className="app-input" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" className="app-input" placeholder={t.password} value={password} onChange={e => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all transform active:scale-95">
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (isSignUp ? t.createAccount : t.login)}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t dark:border-gray-700">
          <button onClick={() => { setIsSignUp(!isSignUp); if(!isSignUp) setStep('type'); }} className="text-primary font-bold hover:underline">
            {isSignUp ? t.hasAccount : t.noAccount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;