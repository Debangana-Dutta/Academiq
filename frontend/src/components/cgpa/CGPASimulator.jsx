import { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { calcCGPA, calcSGPA, GRADE_LABELS, gradeToPoint, getCGPALabel } from '../../utils/academicCalc';
import { SparklesIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DEFAULT_SUBJECT = { subjectName: '', credits: 3, grade: 'A' };

export default function CGPASimulator({ existingCGPA, existingCredits }) {
  const { simulateCGPA } = useAcademic();
  const [subjects, setSubjects] = useState([{ ...DEFAULT_SUBJECT, id: Date.now() }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addRow = () => setSubjects(prev => [...prev, { ...DEFAULT_SUBJECT, id: Date.now() }]);
  const removeRow = (id) => setSubjects(prev => prev.filter(s => s.id !== id));
  const updateRow = (id, field, value) =>
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const simulate = async () => {
    const valid = subjects.filter(s => s.subjectName.trim() && s.credits > 0);
    if (!valid.length) return toast.error('Add at least one subject with a name');

    setLoading(true);
    try {
      const futureSubjects = valid.map(s => ({
        subjectName: s.subjectName,
        credits: Number(s.credits),
        gradePoint: gradeToPoint(s.grade),
      }));

      const data = await simulateCGPA({
        existingEntries: existingCredits > 0 ? [{ sgpa: existingCGPA, totalCredits: existingCredits }] : [],
        futureSubjects,
      });
      setResult(data);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const currentLabel = getCGPALabel(existingCGPA);
  const projectedLabel = result ? getCGPALabel(result.projectedCGPA) : null;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-brand-500" />
        </div>
        <div>
          <h3 className="section-title">CGPA Simulator</h3>
          <p className="text-xs text-slate-400">Test future grades to project your CGPA</p>
        </div>
      </div>

      {/* Current CGPA badge */}
      {existingCGPA > 0 && (
        <div className={`flex items-center justify-between rounded-xl p-3.5 mb-5 ${currentLabel.bg} border border-opacity-20`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current CGPA</p>
            <p className="text-2xl font-bold text-slate-900">{existingCGPA.toFixed(2)}</p>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white/80 ${currentLabel.color}`}>
            {currentLabel.label}
          </span>
        </div>
      )}

      {/* Subject rows */}
      <div className="space-y-2.5 mb-4">
        {subjects.map((s, i) => (
          <div key={s.id} className="flex gap-2 items-center animate-fade-in">
            <input
              placeholder={`Subject ${i + 1}`}
              value={s.subjectName}
              onChange={e => updateRow(s.id, 'subjectName', e.target.value)}
              className="form-input flex-1 min-w-0"
            />
            <input
              type="number" min="0.5" max="10" step="0.5"
              value={s.credits}
              onChange={e => updateRow(s.id, 'credits', e.target.value)}
              className="form-input w-20 text-center"
              title="Credits"
            />
            <select
              value={s.grade}
              onChange={e => updateRow(s.id, 'grade', e.target.value)}
              className="form-select w-24"
            >
              {GRADE_LABELS.map(g => (
                <option key={g} value={g}>{g} ({gradeToPoint(g)})</option>
              ))}
            </select>
            {subjects.length > 1 && (
              <button onClick={() => removeRow(s.id)} className="btn-icon text-danger-400 hover:text-danger-600 flex-shrink-0">
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5">
        <button onClick={addRow} className="btn-ghost text-brand-600 hover:bg-brand-50">
          <PlusIcon className="w-4 h-4" /> Add Subject
        </button>
        <div className="flex-1" />
        <button onClick={simulate} disabled={loading} className="btn-primary">
          {loading ? 'Simulating...' : '⚡ Simulate CGPA'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-xl p-5 border-2 animate-scale-in ${
          result.projectedCGPA >= 7.5 ? 'bg-success-50 border-success-200' :
          result.projectedCGPA >= 6 ? 'bg-brand-50 border-brand-200' : 'bg-warn-50 border-warn-200'
        }`}>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Simulation Result</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500 font-medium">Future Sem SGPA</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{result.futureSGPA?.toFixed(2)}</p>
            </div>
            <div className="border-x border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Projected CGPA</p>
              <p className={`text-3xl font-bold mt-1 ${projectedLabel?.color}`}>
                {result.projectedCGPA?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Credits</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{result.totalCreditsAfter}</p>
            </div>
          </div>
          <div className="mt-3 text-center">
            {existingCGPA > 0 && (
              <span className={`text-sm font-bold ${
                result.projectedCGPA > existingCGPA ? 'text-success-600' :
                result.projectedCGPA < existingCGPA ? 'text-danger-500' : 'text-slate-500'
              }`}>
                {result.projectedCGPA > existingCGPA
                  ? `▲ +${(result.projectedCGPA - existingCGPA).toFixed(2)} improvement`
                  : result.projectedCGPA < existingCGPA
                  ? `▼ ${(result.projectedCGPA - existingCGPA).toFixed(2)} drop`
                  : '→ No change'}
              </span>
            )}
            <span className={`block text-sm font-bold mt-1 ${projectedLabel?.color}`}>
              {projectedLabel?.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
