import { useEffect, useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import AttendanceTable from '../components/attendance/AttendanceTable';
import AttendanceChart from '../components/attendance/AttendanceChart';
import SkipCalculator from '../components/attendance/SkipCalculator';
import { StatCard, PageLoader, Modal } from '../components/ui/index.jsx';
import { ClipboardDocumentCheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SUBJECT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

function AddSubjectModal({ onClose, userSemester }) {
  const { createSubject } = useAcademic();
  const [form, setForm] = useState({ name: '', code: '', credits: 3, instructor: '', color: SUBJECT_COLORS[0], semester: userSemester || 1 });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Subject name required');
    setSaving(true);
    try {
      await createSubject({ ...form, credits: Number(form.credits), semester: Number(form.semester) });
      toast.success(`${form.name} added`);
      onClose();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title="Add Subject">
      <form onSubmit={save} className="flex flex-col max-h-[80vh]">
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-4">
          <div>
            <label className="form-label">Subject Name *</label>
            <input value={form.name} onChange={set('name')} required className="form-input" placeholder="e.g. Data Structures" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Code</label>
              <input value={form.code} onChange={set('code')} className="form-input" placeholder="CS301" />
            </div>
            <div>
              <label className="form-label">Credits *</label>
              <input type="number" min="0.5" max="10" step="0.5" value={form.credits} onChange={set('credits')} className="form-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Semester</label>
              <select value={form.semester} onChange={set('semester')} className="form-select">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>Sem {n}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Color</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {SUBJECT_COLORS.map(c => (
                  <button type="button" key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-1 ring-slate-400' : 'opacity-60'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Adding...' : 'Add'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function AttendancePage() {
  const { attendance, subjects, fetchAttendance, fetchSubjects, loadingStates } = useAcademic();
  const [addOpen, setAddOpen] = useState(false);
  const [tab, setTab] = useState('table');

  useEffect(() => {
    fetchAttendance();
    fetchSubjects();
  }, []);

  if (loadingStates.attendance && !attendance.length) return <PageLoader />;

  const overall = attendance.length
    ? Math.round(attendance.reduce((s, r) => s + r.percentage, 0) / attendance.length)
    : 0;

  return (
    <div className="page-container max-w-6xl mx-auto px-4 py-6">
      {/* Header: Sized down for better vertical space */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Attendance</h2>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">Semester Intelligence & Analytics</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
          <PlusIcon className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Stats Row: Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard title="Subjects" value={subjects.length} icon={ClipboardDocumentCheckIcon} color="brand" />
        <StatCard title="Aggregate" value={`${overall}%`} color={overall >= 75 ? 'success' : 'warn'} />
        <StatCard title="Safe" value={attendance.filter(r => r.percentage >= 75).length} subtitle="≥75%" color="success" />
        <StatCard title="At Risk" value={attendance.filter(r => r.percentage > 0 && r.percentage < 75).length} subtitle="<75%" color="danger" />
      </div>

      {/* Sub-Header + Tabs */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-brand-500 rounded-full" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Overview</span>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {[['table', 'List'], ['chart', 'Charts']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all ${tab === id ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'table' ? (
        <div className="animate-fade-in">
          <AttendanceTable data={attendance} />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
          <AttendanceChart attendanceData={attendance} />
          <SkipCalculator attendanceData={attendance} />
        </div>
      )}

      {addOpen && <AddSubjectModal onClose={() => setAddOpen(false)} userSemester={1} />}
    </div>
  );
}