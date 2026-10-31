// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  // Jab tak auth check ho raha hai, kuch mat dikhao
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Agar login nahi hai toh login page pe bhej do
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Agar role match nahi karta (e.g. student faculty page khol raha hai)
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'faculty' ? '/faculty' : '/student'} replace />;
  }

  return children;
}