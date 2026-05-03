import { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { calcAttendanceStats, getAttendanceColor, getAttendanceBg } from '../../utils/academicCalc';
import { ProgressBar, Badge, EmptyState, Modal } from '../ui/index.jsx';
import { PencilIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function EditModal({ record, onClose }) {
  const { setManualAttendance } = useAcademic();
  const [total, setTotal] = useState(record.totalClasses);
  const [attended, setAttended] = useState(record.attended);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (attended > total) return toast.error('Attended cannot exceed total classes');
    setSaving(true);
    try {
      await setManualAttendance(record.subject?._id, { totalClasses: Number(total), attended: Number(attended) });
      toast.success('Attendance updated');
      onClose();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title={`Edit — ${record.subject?.name}`}>
      <div className="space-y-4">
        <div>
          <label className="form-label">Total Classes</label>
          <input type="number" min="0" value={total} onChange={e => setTotal(e.target.value)} className="form-input" />
        </div>
        <div>
          <label className="form-label">Classes Attended</label>
          <input type="number" min="0" max={total} value={attended} onChange={e => setAttended(e.target.value)} className="form-input" />
        </div>
        {total > 0 && (
          <div className="bg-slate-50 rounded-xl p-3">
            <ProgressBar value={attended} max={total} />
            <p className="text-sm font-semibold text-slate-700 mt-2">
              {((attended / total) * 100).toFixed(1)}% attendance
            </p>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  );
}

function LogModal({ subject, onClose }) {
  const { logAttendance } = useAcademic();
  const [status, setStatus] = useState('present');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await logAttendance({ subjectId: subject._id, status, date });
      toast.success(`Logged as ${status}`);
      onClose();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title={`Log Class — ${subject.name}`}>
      <div className="space-y-4">
        <div>
          <label className="form-label">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" />
        </div>
        <div>
          <label className="form-label">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {['present', 'absent', 'medical', 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${
                  status === s
                    ? s === 'present' ? 'border-success-500 bg-success-50 text-success-700'
                    : s === 'absent'  ? 'border-danger-500 bg-danger-50 text-danger-600'
                    : s === 'medical' ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-400 bg-slate-100 text-slate-600'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Log Class'}</button>
        </div>
      </div>
    </Modal>
  );
}

export default function AttendanceTable({ data }) {
  const [editRecord, setEditRecord] = useState(null);
  const [logSubject, setLogSubject] = useState(null);

  if (!data.length) {
    return <EmptyState icon={ClipboardDocumentCheckIcon} title="No subjects yet" description="Add subjects to start tracking attendance." />;
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Attended / Total</th>
              <th>Percentage</th>
              <th>Status</th>
              <th>Safe to Skip</th>
              <th>Must Attend</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(record => {
              const stats = calcAttendanceStats(record.totalClasses, record.attended);
              const statusMap = {
                excellent: { label: 'Excellent', variant: 'success' },
                safe: { label: 'Safe', variant: 'success' },
                'at-risk': { label: 'At Risk', variant: 'warn' },
                critical: { label: 'Critical', variant: 'danger' },
              };
              const s = statusMap[stats.status];
              return (
                <tr key={record._id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: record.subject?.color || '#6366f1' }} />
                      <div>
                        <p className="font-semibold text-slate-800">{record.subject?.name}</p>
                        {record.subject?.code && <p className="text-xs text-slate-400">{record.subject.code}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono font-semibold text-slate-800">{record.attended}</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="font-mono text-slate-500">{record.totalClasses}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <ProgressBar value={stats.percentage} className="flex-1" />
                      <span className={`text-sm font-bold tabular-nums ${getAttendanceColor(stats.percentage)}`}>
                        {stats.percentage}%
                      </span>
                    </div>
                  </td>
                  <td><Badge variant={s.variant}>{s.label}</Badge></td>
                  <td>
                    <span className={`font-bold tabular-nums ${stats.safeToSkip > 0 ? 'text-success-600' : 'text-slate-400'}`}>
                      {stats.safeToSkip > 0 ? `${stats.safeToSkip} classes` : '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`font-bold tabular-nums ${stats.mustAttend > 0 ? 'text-danger-500' : 'text-success-500'}`}>
                      {stats.mustAttend > 0 ? `${stats.mustAttend} classes` : '✓ OK'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setLogSubject(record.subject)} className="btn-icon" title="Log class">
                        <ClipboardDocumentCheckIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditRecord(record)} className="btn-icon" title="Edit">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editRecord && <EditModal record={editRecord} onClose={() => setEditRecord(null)} />}
      {logSubject && <LogModal subject={logSubject} onClose={() => setLogSubject(null)} />}
    </>
  );
}
