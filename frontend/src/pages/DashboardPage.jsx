import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAcademic } from '../context/AcademicContext';
import { StatCard, PageLoader, Badge, ProgressBar } from '../components/ui/index.jsx';
import { calcAttendanceStats, getCGPALabel, getAttendanceColor } from '../utils/academicCalc';
import {
  ClipboardDocumentCheckIcon, ChartBarIcon,
  DocumentTextIcon, ExclamationTriangleIcon,
  CheckCircleIcon, ArrowRightIcon, AcademicCapIcon,
} from '@heroicons/react/24/outline';

function SubjectRow({ record }) {
  const stats = calcAttendanceStats(record.totalClasses, record.attended);
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: record.subject?.color || '#6366f1' }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{record.subject?.name}</p>
        <ProgressBar value={stats.percentage} className="mt-1" />
      </div>
      <span className={`text-sm font-bold tabular-nums flex-shrink-0 ${getAttendanceColor(stats.percentage)}`}>
        {stats.percentage}%
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { subjects, attendance, cgpaData, notes, fetchSubjects, fetchAttendance, fetchCGPA, fetchNotes, loadingStates } = useAcademic();

  useEffect(() => {
    fetchSubjects();
    fetchAttendance();
    fetchCGPA();
    fetchNotes();
  }, []);

  if (loadingStates.subjects && !subjects.length) return <PageLoader />;

  const overallPct = attendance.length
    ? Math.round(attendance.reduce((s, r) => s + r.percentage, 0) / attendance.length)
    : 0;
  const atRiskCount = attendance.filter(r => r.percentage > 0 && r.percentage < 75).length;
  const cgpaLabel = getCGPALabel(cgpaData.cgpa);
  const pinnedNotes = notes.filter(n => n.isPinned);
  const recentNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3);

  const statsData = [
    { title: 'Subjects Enrolled', value: subjects.length, subtitle: `Semester ${user?.semester}`, icon: AcademicCapIcon, color: 'brand' },
    { title: 'Overall Attendance', value: `${overallPct}%`, subtitle: attendance.length ? `${attendance.filter(r => r.percentage >= 75).length} of ${attendance.length} safe` : 'No data yet', icon: ClipboardDocumentCheckIcon, color: overallPct >= 75 ? 'success' : overallPct >= 60 ? 'warn' : 'danger' },
    { title: 'Current CGPA', value: cgpaData.cgpa > 0 ? cgpaData.cgpa.toFixed(2) : '—', subtitle: cgpaData.cgpa > 0 ? cgpaLabel.label : 'No semesters added', icon: ChartBarIcon, color: 'brand' },
    { title: 'Notes Saved', value: notes.length, subtitle: `${pinnedNotes.length} pinned`, icon: DocumentTextIcon, color: 'slate' },
  ];

  return (
    <div className="page-container">
      {/* Welcome */}
      <div className="page-header">
        <h2 className="page-title">Overview</h2>
        <p className="page-subtitle">Here's what's happening with your academics.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-stagger">
        {statsData.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Alert banner */}
      {atRiskCount > 0 && (
        <div className="flex items-center gap-3 bg-warn-50 border border-warn-200 rounded-2xl px-5 py-3.5 mb-8 animate-fade-in">
          <ExclamationTriangleIcon className="w-5 h-5 text-warn-500 flex-shrink-0" />
          <p className="text-sm font-medium text-warn-700 flex-1">
            <span className="font-bold">{atRiskCount} subject{atRiskCount > 1 ? 's are' : ' is'} at risk</span> — attendance below 75%. Take action before it's too late.
          </p>
          <Link to="/attendance" className="btn-ghost text-warn-600 hover:bg-warn-100 text-xs">
            View <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance breakdown */}
        <div className="lg:col-span-2 card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Attendance Status</h3>
            <Link to="/attendance" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
          {attendance.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {attendance.slice(0, 6).map(r => <SubjectRow key={r._id} record={r} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ClipboardDocumentCheckIcon className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-500">No subjects added yet</p>
              <Link to="/attendance" className="btn-primary mt-3 text-xs">Add Subjects</Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* CGPA snapshot */}
          <div className="card p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-title">CGPA Snapshot</h3>
              <Link to="/cgpa" className="text-xs font-semibold text-brand-600 hover:text-brand-700">Open →</Link>
            </div>
            {cgpaData.cgpa > 0 ? (
              <>
                <div className={`text-4xl font-bold tabular-nums mb-1 ${cgpaLabel.color}`}>
                  {cgpaData.cgpa.toFixed(2)}
                </div>
                <Badge variant={cgpaData.cgpa >= 8 ? 'success' : cgpaData.cgpa >= 6 ? 'brand' : 'warn'}>
                  {cgpaLabel.label}
                </Badge>
                <p className="text-xs text-slate-400 mt-2">{cgpaData.totalCredits} total credits · {cgpaData.semesters.length} semesters</p>
                <div className="mt-3 space-y-1.5">
                  {cgpaData.semesters.slice(-3).map(sem => (
                    <div key={sem.semester} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Semester {sem.semester}</span>
                      <span className="font-bold text-slate-700 tabular-nums">{sem.sgpa?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-slate-400 mb-2">No CGPA data yet</p>
                <Link to="/cgpa" className="btn-primary text-xs">Add Semester</Link>
              </div>
            )}
          </div>

          {/* Recent notes */}
          <div className="card p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-title">Recent Notes</h3>
              <Link to="/notes" className="text-xs font-semibold text-brand-600 hover:text-brand-700">View all →</Link>
            </div>
            {recentNotes.length > 0 ? (
              <div className="space-y-2.5">
                {recentNotes.map(note => (
                  <div key={note._id} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{note.title}</p>
                      <p className="text-xs text-slate-400 truncate">{note.content.slice(0, 60)}…</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-slate-400 mb-2">No notes yet</p>
                <Link to="/notes" className="btn-primary text-xs">Create Note</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
