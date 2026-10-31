// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import FacultyPage from './pages/FacultyPage';
import StudentPage from './pages/StudentPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Faculty Routes */}
        <Route 
          path="/faculty" 
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - kisi bhi unknown URL pe login pe bhej do */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}