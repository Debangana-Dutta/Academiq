import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AcademicProvider } from './context/AcademicContext';
import Layout from './components/layout/Layout';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage  from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import CGPAPage       from './pages/CGPAPage';
import NotesPage      from './pages/NotesPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 mt-3 font-medium">Loading AcademiQ...</p>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AcademicProvider>
            <Layout><DashboardPage /></Layout>
          </AcademicProvider>
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute>
          <AcademicProvider>
            <Layout><AttendancePage /></Layout>
          </AcademicProvider>
        </ProtectedRoute>
      } />
      <Route path="/cgpa" element={
        <ProtectedRoute>
          <AcademicProvider>
            <Layout><CGPAPage /></Layout>
          </AcademicProvider>
        </ProtectedRoute>
      } />
      <Route path="/notes" element={
        <ProtectedRoute>
          <AcademicProvider>
            <Layout><NotesPage /></Layout>
          </AcademicProvider>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '12px',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
