import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AcademicCapIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <AcademicCapIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AcademiQ</span>
        </div>
        <div>
          <blockquote className="text-white/90 text-2xl font-light leading-relaxed mb-6">
            "Track every class, predict every grade,<br />ace every semester."
          </blockquote>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '75%', label: 'Smart Threshold' },
              { value: '10pt', label: 'CGPA Scale' },
              { value: '∞', label: 'Note Storage' },
            ].map(item => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-white/70 font-medium mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} AcademiQ. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/30">
              <AcademicCapIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">AcademiQ</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="form-label">Email address</label>
              <input type="email" value={form.email} onChange={set('email')} required
                className="form-input" placeholder="you@university.edu" autoComplete="email" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                  className="form-input pr-10" placeholder="••••••••" autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">Create one free</Link>
          </p>

          {/* Demo credentials hint */}
          <div className="mt-6 bg-brand-50 border border-brand-100 rounded-xl p-3.5 text-xs text-brand-700">
            <p className="font-semibold mb-1">Demo credentials</p>
            <p>Email: <span className="font-mono">demo@academiq.app</span></p>
            <p>Password: <span className="font-mono">Demo@1234</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
