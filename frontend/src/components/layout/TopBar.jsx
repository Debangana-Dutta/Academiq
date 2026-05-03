import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BellIcon } from '@heroicons/react/24/outline';

const ROUTE_META = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your academic overview' },
  '/attendance': { title: 'Attendance Tracker', subtitle: 'Monitor your class attendance' },
  '/cgpa': { title: 'CGPA Planner', subtitle: 'Simulate and track your grades' },
  '/notes': { title: 'Notes Repository', subtitle: 'Your organised study notes' },
};

export default function TopBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const meta = ROUTE_META[pathname] || { title: 'AcademiQ', subtitle: '' };
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200/80 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">{meta.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{meta.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-700">{greeting}, {user?.name?.split(' ')[0]}</p>
            <p className="text-xs text-slate-400">
              {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md shadow-brand-500/20">
            {user?.initials || '?'}
          </div>
        </div>
      </div>
    </header>
  );
}
