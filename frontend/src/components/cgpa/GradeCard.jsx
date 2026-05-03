import { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { GRADE_LABELS, gradeToPoint } from '../../utils/academicCalc';
import { Modal } from '../ui/index.jsx';
import { PencilIcon, TrashIcon, PlusIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function SemesterFormModal({ existing, onClose }) {
  const { addSemester } = useAcademic();
  const [semester, setSemester] = useState(existing?.semester || '');
  const [subjects, setSubjects] = useState(
    existing?.subjects?.map(s => ({ ...s, id: Date.now() + Math.random() })) ||
    [{ id: Date.now(), subjectName: '', credits: 3, gradePoint: 8 }]
  );
  const [saving, setSaving] = useState(false);

  const addRow = () => setSubjects(prev => [...prev, { id: Date.now(), subjectName: '', credits: 3, gradePoint: 8 }]);
  const removeRow = (id) => setSubjects(prev => prev.filter(s => s.id !== id));
  const updateRow = (id, field, value) =>
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const save = async () => {
    if (!semester) return toast.error('Semester number required');
    const valid = subjects.filter(s => s.subjectName.trim() && s.credits > 0);
    if (!valid.length) return toast.error('Add at least one subject');

    setSaving(true);
    try {
      await addSemester({
        semester: Number(semester),
        subjects: valid.map(s => ({ subjectName: s.subjectName, credits: Number(s.credits), gradePoint: Number(s.gradePoint) })),
      });
      toast.success(existing ? 'Semester updated' : 'Semester added');
      onClose();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title={existing ? `Edit Semester ${existing.semester}` : 'Add Semester'} size="lg">
      <div className="space-y-4">
        <div>
          <label className="form-label">Semester Number</label>
          <input type="number" min="1" max="12" value={semester} onChange={e => setSemester(e.target.value)}
            className="form-input w-32" placeholder="e.g. 3" disabled={!!existing} />
        </div>

        <div>
          <label className="form-label">Subjects</label>
          <div className="space-y-2">
            {subjects.map((s, i) => (
              <div key={s.id} className="flex gap-2 items-center">
                <input placeholder={`Subject ${i + 1}`} value={s.subjectName}
                  onChange={e => updateRow(s.id, 'subjectName', e.target.value)}
                  className="form-input flex-1" />
                <input type="number" min="0.5" max="10" step="0.5" value={s.credits}
                  onChange={e => updateRow(s.id, 'credits', e.target.value)}
                  className="form-input w-20 text-center" title="Credits" />
                <select value={s.gradePoint} onChange={e => updateRow(s.id, 'gradePoint', e.target.value)}
                  className="form-select w-24">
                  {GRADE_LABELS.map(g => <option key={g} value={gradeToPoint(g)}>{g} ({gradeToPoint(g)})</option>)}
                </select>
                {subjects.length > 1 && (
                  <button onClick={() => removeRow(s.id)} className="btn-icon text-danger-400">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addRow} className="btn-ghost text-brand-600 hover:bg-brand-50 mt-2 text-sm">
            <PlusIcon className="w-4 h-4" /> Add Subject
          </button>
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : 'Save Semester'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function GradeCard({ entry, onDelete }) {
  const [editing, setEditing] = useState(false);

  const sgpaColor =
    entry.sgpa >= 9 ? 'text-success-600' :
    entry.sgpa >= 7.5 ? 'text-brand-600' :
    entry.sgpa >= 6 ? 'text-warn-500' : 'text-danger-500';

  return (
    <>
      <div className="card-hover p-5 animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-800">Semester {entry.semester}</h4>
              {entry.isLocked && <LockClosedIcon className="w-3.5 h-3.5 text-slate-400" />}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{entry.totalCredits} credits · {entry.subjects?.length} subjects</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setEditing(true)} className="btn-icon"><PencilIcon className="w-4 h-4" /></button>
            <button onClick={onDelete} className="btn-icon text-danger-400 hover:text-danger-600"><TrashIcon className="w-4 h-4" /></button>
          </div>
        </div>

        {/* SGPA display */}
        <div className="flex items-end gap-1 mb-3">
          <span className={`text-3xl font-bold tabular-nums ${sgpaColor}`}>{entry.sgpa?.toFixed(2)}</span>
          <span className="text-sm text-slate-400 mb-1 font-medium">SGPA</span>
        </div>

        {/* Subject list */}
        <div className="space-y-1.5">
          {entry.subjects?.slice(0, 4).map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-slate-600 truncate flex-1">{s.subjectName}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-slate-400">{s.credits}cr</span>
                <span className="text-xs font-bold text-slate-700 w-6 text-right">{s.gradePoint}</span>
              </div>
            </div>
          ))}
          {entry.subjects?.length > 4 && (
            <p className="text-xs text-slate-400">+{entry.subjects.length - 4} more subjects</p>
          )}
        </div>
      </div>

      {editing && <SemesterFormModal existing={entry} onClose={() => setEditing(false)} />}
    </>
  );
}

export { SemesterFormModal };
