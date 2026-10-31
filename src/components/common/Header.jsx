// src/components/common/Header.jsx
import { useState, useEffect } from 'react';
import { GraduationCap, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title, roleBadge, colorTheme = 'indigo' }) {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000); // Har minute update hoga
    return () => clearInterval(timer);
  }, []);

  const initials = user?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const themeClasses = colorTheme === 'emerald' 
    ? 'bg-emerald-600 text-emerald-50 shadow-emerald-200' 
    : 'bg-indigo-600 text-indigo-50 shadow-indigo-200';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl text-white shadow-md ${themeClasses}`}>
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-tight">{title}</h1>
            <p className="text-xs text-slate-500 hidden sm:block">EduHub Portal</p>
          </div>
        </div>

        {/* Right: Time, Avatar, Logout */}
        <div className="flex items-center gap-4">
          {/* Live Date/Time */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {time.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${
                colorTheme === 'emerald' ? 'text-emerald-600' : 'text-indigo-600'
              }`}>{roleBadge}</p>
            </div>
            
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
               colorTheme === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500'
            }`}>
              {initials}
            </div>

            <button 
              onClick={logout} 
              className="ml-2 flex items-center gap-1.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}