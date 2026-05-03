import { useEffect, useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import AttendanceTable from '../components/attendance/AttendanceTable';
import AttendanceChart from '../components/attendance/AttendanceChart';
import SkipCalculator from '../components/attendance/SkipCalculator';
import { StatCard, PageLoader, Modal } from '../components/ui/index.jsx';
import { ClipboardDocumentCheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
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
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="form-label">Subject Name *</label>
          <input value={form.name} onChange={set('name')} required className="form-input" placeholder="e.g. Data Structures" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Subject Code</label>
            <input value={form.code} onChange={set('code')} className="form-input" placeholder="CS301" />
          </div>
          <div>
            <label className="form-label">Credits *</label>
            <input type="number" min="0.5" max="10" step="0.5" value={form.credits} onChange={set('credits')} className="form-input" />
          </div>
        </div>
        <div>
          <label className="form-label">Instructor</label>
          <input value={form.instructor} onChange={set('instructor')} className="form-input" placeholder="Dr. Mehta" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">Semester</label>
            <select value={form.semester} onChange={set('semester')} className="form-select">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>Semester {n}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Color</label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {SUBJECT_COLORS.map(c => (
                <button type="button" key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${form.color === c ? 'ring-2 ring-offset-1 ring-slate-500 scale-110' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Adding...' : 'Add Subject'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function AttendancePage() {
  const { attendance, subjects, fetchAttendance, fetchSubjects, deleteSubject, loadingStates } = useAcademic();
  const [addOpen, setAddOpen] = useState(false);
  const [tab, setTab] = useState('table');

  useEffect(() => {
    fetchAttendance();
    fetchSubjects();
  }, []);

  if (loadingStates.attendance && !attendance.length) return <PageLoader />;

  const safe = attendance.filter(r => r.percentage >= 75).length;
  const atRisk = attendance.filter(r => r.percentage > 0 && r.percentage < 75).length;
  const overall = attendance.length
    ? Math.round(attendance.reduce((s, r) => s + r.percentage, 0) / attendance.length)
    : 0;

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="page-title">Attendance Tracker</h2>
          <p className="page-subtitle">75% threshold enforcement & skip calculator</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary">
          <PlusIcon className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-stagger">
        <StatCard title="Total Subjects" value={subjects.length} icon={ClipboardDocumentCheckIcon} color="brand" />
        <StatCard title="Overall Attendance" value={`${overall}%`} color={overall >= 75 ? 'success' : 'warn'} />
        <StatCard title="Safe Subjects" value={safe} subtitle="≥ 75%" color="success" />
        <StatCard title="At Risk" value={atRisk} subtitle="< 75%" color={atRisk > 0 ? 'danger' : 'slate'} />
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {[['table', 'Table View'], ['chart', 'Chart & Calculator']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
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
