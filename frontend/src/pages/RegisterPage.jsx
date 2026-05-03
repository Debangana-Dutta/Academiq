import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AcademicCapIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', institution: '', semester: '1' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      await register({ ...form, semester: Number(form.semester) });
      toast.success('Account created! Welcome to AcademiQ');
      navigate('/dashboard');
    } catch (err) { toast.error(err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-gradient-to-br from-emerald-600 via-brand-500 to-brand-600 p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <AcademicCapIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">AcademiQ</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Your academic<br />command centre.
          </h2>
          <ul className="space-y-3">
            {[
              'Smart attendance tracking with skip calculator',
              'CGPA simulator to plan ahead',
              'Organised notes with full-text search',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-white/85 text-sm">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-white/40 text-sm">Free forever for students.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">AcademiQ</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>
          <p className="text-sm text-slate-500 mb-8">Start tracking your academic journey</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" value={form.name} onChange={set('name')} required
                className="form-input" placeholder="Arjun Sharma" autoComplete="name" />
            </div>
            <div>
              <label className="form-label">Email address</label>
              <input type="email" value={form.email} onChange={set('email')} required
                className="form-input" placeholder="you@university.edu" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                  className="form-input pr-10" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Must include uppercase, lowercase and a number</p>
            </div>
            <div>
              <label className="form-label">Institution <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="text" value={form.institution} onChange={set('institution')}
                className="form-input" placeholder="IIT Guwahati" />
            </div>
            <div>
              <label className="form-label">Current Semester</label>
              <select value={form.semester} onChange={set('semester')} className="form-select">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>Semester {n}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
