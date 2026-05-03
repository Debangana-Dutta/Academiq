import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HomeIcon, ClipboardDocumentCheckIcon, ChartBarIcon,
  DocumentTextIcon, ArrowLeftOnRectangleIcon, AcademicCapIcon,
  Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/attendance', label: 'Attendance', icon: ClipboardDocumentCheckIcon },
  { to: '/cgpa', label: 'CGPA Planner', icon: ChartBarIcon },
  { to: '/notes', label: 'Notes', icon: DocumentTextIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); toast.success('Logged out successfully'); }
    catch { toast.error('Logout failed'); }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/30">
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 tracking-tight">AcademiQ</span>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Student Suite</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-6 pt-4 border-t border-slate-100 mt-4">
        <div className="flex items-center gap-3 px-2 py-2.5 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.initials || '??'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="nav-item w-full text-danger-500 hover:bg-danger-50 hover:text-danger-600">
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 btn-icon bg-white shadow-md border border-slate-200"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 btn-icon">
              <XMarkIcon className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
