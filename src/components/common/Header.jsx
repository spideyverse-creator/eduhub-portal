// src/components/common/Header.jsx
import { useState, useEffect } from 'react';
import { GraduationCap, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom'; // Profile link ke liye

export default function Header({ title, roleBadge, colorTheme = 'indigo' }) {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Avatar URL banane ka function
  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&bold=true`;
  };

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
            
            {/* Avatar Link to Profile */}
            <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-indigo-400 transition-all">
              <img 
                src={getAvatarUrl(user?.name)} 
                alt={user?.name} 
                className="w-full h-full object-cover" 
              />
            </Link>

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