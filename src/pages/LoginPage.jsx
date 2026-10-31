// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Lock, Mail, AlertCircle, 
  Sparkles, LogIn, CheckCircle2, ShieldCheck, 
  UploadCloud, Megaphone 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'faculty' ? '/faculty' : '/student');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Thoda sa artificial delay taaki loading dikhe
    setTimeout(() => {
      const result = login(identifier, password);
      if (result.success) {
        navigate(result.role === 'faculty' ? '/faculty' : '/student');
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    }, 600);
  };

  const fillDemo = (role) => {
    if (role === 'faculty') {
      setIdentifier('faculty1'); setPassword('faculty123');
    } else {
      setIdentifier('student1'); setPassword('student123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* LEFT SIDE: Branding & Info (Sirf bade screens pe dikhega) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
              <GraduationCap className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EduHub Portal</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Centralized Learning.<br/>Zero Chaos.
          </h1>
          <p className="text-indigo-200 text-lg max-w-md">
            A secure platform where faculty can share materials and students can access them anytime, anywhere.
          </p>

          {/* Features List */}
          <div className="mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-800/50 p-2 rounded-lg shrink-0"><UploadCloud className="w-5 h-5 text-indigo-300" /></div>
              <div>
                <h4 className="font-semibold text-white">Easy Uploads</h4>
                <p className="text-sm text-indigo-200">Faculty can upload notes, lab manuals and assignments in seconds.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-indigo-800/50 p-2 rounded-lg shrink-0"><Megaphone className="w-5 h-5 text-indigo-300" /></div>
              <div>
                <h4 className="font-semibold text-white">Instant Notices</h4>
                <p className="text-sm text-indigo-200">Broadcast important announcements to specific subjects.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-indigo-800/50 p-2 rounded-lg shrink-0"><ShieldCheck className="w-5 h-5 text-indigo-300" /></div>
              <div>
                <h4 className="font-semibold text-white">Role Based Security</h4>
                <p className="text-sm text-indigo-200">Separate interfaces for Faculty and Students. No accidental deletions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-indigo-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Built for Department of Computer Science
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          
          {/* Mobile Header (Sirf mobile pe dikhega) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-indigo-600 p-2 rounded-xl text-white"><GraduationCap className="w-6 h-6" /></div>
            <h1 className="text-2xl font-bold text-slate-900">EduHub Portal</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 text-rose-700 text-sm p-3.5 rounded-xl flex items-start gap-2 border border-rose-200 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email or Username</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text" required
                  value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="faculty1 or your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><LogIn className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs"><span className="bg-slate-50 px-3 text-slate-400 uppercase font-semibold">Demo Accounts</span></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => fillDemo('faculty')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-indigo-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition">
                <Sparkles className="w-3.5 h-3.5" /> Faculty
              </button>
              <button onClick={() => fillDemo('student')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-emerald-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition">
                <Sparkles className="w-3.5 h-3.5" /> Student
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}