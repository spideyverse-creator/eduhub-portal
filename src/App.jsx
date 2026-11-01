// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import FacultyPage from './pages/FacultyPage';
import StudentPage from './pages/StudentPage';
import ProfilePage from './pages/ProfilePage';
import { Loader2 } from 'lucide-react';

// 🔥 Naya Wrapper jo tab tak wait karega jab tak auth load na ho
function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-slate-600 font-semibold">Loading EduHub...</h2>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/faculty" element={
        <ProtectedRoute allowedRole="faculty"><FacultyPage /></ProtectedRoute>
      } />
      <Route path="/student" element={
        <ProtectedRoute allowedRole="student"><StudentPage /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      } />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}