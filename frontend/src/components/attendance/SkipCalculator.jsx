import { useState } from 'react';
import { calcAttendanceStats } from '../../utils/academicCalc';
import { ProgressBar } from '../ui/index.jsx';
import { CalculatorIcon } from '@heroicons/react/24/outline';

export default function SkipCalculator({ attendanceData }) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [simMode, setSimMode] = useState('skip'); // 'skip' | 'attend'
  const [simCount, setSimCount] = useState(1);

  const record = attendanceData.find(a => a.subject?._id === selectedSubject);
  const stats = record ? calcAttendanceStats(record.totalClasses, record.attended) : null;

  const projected = stats
    ? simMode === 'skip'
      ? stats.projectSkip(Number(simCount))
      : stats.projectAttend(Number(simCount))
    : null;

  const delta = projected !== null && stats ? projected - stats.percentage : null;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
          <CalculatorIcon className="w-5 h-5 text-brand-500" />
        </div>
        <div>
          <h3 className="section-title">Skip Calculator</h3>
          <p className="text-xs text-slate-400">Simulate future attendance impact</p>
        </div>
      </div>

      {/* Subject picker */}
      <div className="mb-4">
        <label className="form-label">Select Subject</label>
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="form-select">
          <option value="">— Choose a subject —</option>
          {attendanceData.map(a => (
            <option key={a.subject?._id} value={a.subject?._id}>
              {a.subject?.name} ({a.percentage}%)
            </option>
          ))}
        </select>
      </div>

      {stats && (
        <>
          {/* Current state */}
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current</span>
              <span className="text-lg font-bold text-slate-900">{stats.percentage}%</span>
            </div>
            <ProgressBar value={stats.percentage} />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center">
                <p className="text-xl font-bold text-success-600">{stats.safeToSkip}</p>
                <p className="text-xs text-slate-500 font-medium">Safe to Skip</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-danger-500">{stats.mustAttend}</p>
                <p className="text-xs text-slate-500 font-medium">Must Attend</p>
              </div>
            </div>
          </div>

          {/* Simulation */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setSimMode('skip')}
              className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                simMode === 'skip' ? 'border-danger-500 bg-danger-50 text-danger-600' : 'border-slate-200 text-slate-600'
              }`}
            >
              Skip Classes
            </button>
            <button
              onClick={() => setSimMode('attend')}
              className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                simMode === 'attend' ? 'border-success-500 bg-success-50 text-success-600' : 'border-slate-200 text-slate-600'
              }`}
            >
              Attend Classes
            </button>
          </div>

          <div className="mb-4">
            <label className="form-label">
              {simMode === 'skip' ? 'Skip' : 'Attend'} how many classes?
            </label>
            <input
              type="number" min="1" max="50" value={simCount}
              onChange={e => setSimCount(Math.max(1, e.target.value))}
              className="form-input"
            />
          </div>

          {/* Projected result */}
          {projected !== null && (
            <div className={`rounded-xl p-4 border-2 ${
              projected >= 75 ? 'bg-success-50 border-success-200' : 'bg-danger-50 border-danger-200'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    After {simMode === 'skip' ? 'skipping' : 'attending'} {simCount} class{simCount > 1 ? 'es' : ''}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${projected >= 75 ? 'text-success-700' : 'text-danger-600'}`}>
                    {projected}%
                  </p>
                </div>
                <span className={`text-sm font-bold ${delta >= 0 ? 'text-success-600' : 'text-danger-500'}`}>
                  {delta > 0 ? '+' : ''}{delta?.toFixed(1)}%
                </span>
              </div>
              <ProgressBar value={projected} />
              <p className={`text-xs font-semibold mt-2 ${projected >= 75 ? 'text-success-700' : 'text-danger-600'}`}>
                {projected >= 75
                  ? `✓ You'll maintain the 75% threshold`
                  : `✗ You'll fall below 75% — risky!`
                }
              </p>
            </div>
          )}
        </>
      )}

      {!selectedSubject && (
        <div className="text-center py-6">
          <p className="text-sm text-slate-400">Select a subject above to simulate attendance scenarios</p>
        </div>
      )}
    </div>
  );
}
