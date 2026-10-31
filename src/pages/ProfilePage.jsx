import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import { CheckCircle, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  
  if (!user) return null;

  const totalCompleted = user.completedResources?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header title="My Profile" roleBadge={user.role} colorTheme={user.role === 'faculty' ? 'indigo' : 'emerald'} />
      
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          
          <div className="relative z-10 mt-12">
            <img 
              src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff&size=128&bold=true`} 
              alt={user.name}
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg mx-auto"
            />
            <h1 className="text-2xl font-bold text-slate-900 mt-4">{user.name}</h1>
            <p className="text-slate-500 font-medium">{user.email}</p>
            <span className="inline-block mt-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold">Resources Completed</p>
              <p className="text-2xl font-bold text-slate-900">{totalCompleted}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold">Account Status</p>
              <p className="text-lg font-bold text-emerald-600">Verified & Active</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
           <Link to={user.role === 'faculty' ? '/faculty' : '/student'} className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition">
             <BookOpen className="w-5 h-5" /> Go to Dashboard
           </Link>
        </div>

      </div>
    </div>
  );
}