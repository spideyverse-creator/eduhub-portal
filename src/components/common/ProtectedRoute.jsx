import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react'; // Icon import karo

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  // 🔥 Smooth Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-slate-600 font-semibold animate-pulse">Loading your account...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'faculty' ? '/faculty' : '/student'} replace />;
  }

  return children;
}