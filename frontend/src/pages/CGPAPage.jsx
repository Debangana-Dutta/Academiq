import { useEffect, useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import CGPASimulator from '../components/cgpa/CGPASimulator';
import GradeCard, { SemesterFormModal } from '../components/cgpa/GradeCard';
import { StatCard, PageLoader, EmptyState } from '../components/ui/index.jsx';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { ChartBarIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getCGPALabel } from '../utils/academicCalc';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CGPAPage() {
  const { cgpaData, fetchCGPA, deleteSemester, loadingStates } = useAcademic();
  const [addOpen, setAddOpen] = useState(false);
  const [tab, setTab] = useState('overview');

  useEffect(() => { fetchCGPA(); }, []);

  if (loadingStates.cgpa && !cgpaData.semesters.length) return <PageLoader />;

  const { cgpa, semesters, totalCredits } = cgpaData;
  const cgpaLabel = getCGPALabel(cgpa);

  const handleDelete = async (semester) => {
    if (!window.confirm(`Delete semester ${semester} data? This cannot be undone.`)) return;
    try { await deleteSemester(semester); toast.success(`Semester ${semester} deleted`); }
    catch (e) { toast.error(e.message); }
  };

  const chartData = {
    labels: semesters.map(s => `Sem ${s.semester}`),
    datasets: [{
      label: 'SGPA',
      data: semesters.map(s => s.sgpa),
      backgroundColor: semesters.map(s => s.sgpa >= 8.5 ? '#10b981' : s.sgpa >= 7 ? '#6366f1' : s.sgpa >= 6 ? '#f59e0b' : '#ef4444'),
      borderRadius: 8,
      borderSkipped: false,
    }],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` SGPA: ${c.raw?.toFixed(2)}` } } },
    scales: {
      y: { min: 0, max: 10, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  return (
    <div className="page-container">
      <div className="page-header flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="page-title">CGPA Planner</h2>
          <p className="page-subtitle">Track historical grades and simulate future performance</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary">
          <PlusIcon className="w-4 h-4" /> Add Semester
        </button>
      </div>

      {/* CGPA Hero */}
      {cgpa > 0 && (
        <div className="bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-1">Cumulative GPA</p>
              <div className="flex items-end gap-2">
                <span className="text-6xl font-bold tabular-nums">{cgpa.toFixed(2)}</span>
                <span className="text-white/60 text-lg mb-2">/ 10.0</span>
              </div>
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full mt-2">
                {cgpaLabel.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">{semesters.length}</p>
                <p className="text-white/70 text-xs font-medium mt-0.5">Semesters</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">{totalCredits}</p>
                <p className="text-white/70 text-xs font-medium mt-0.5">Total Credits</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {[['overview', 'Semesters'], ['chart', 'SGPA Chart'], ['simulate', 'Simulator']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="animate-fade-in">
          {semesters.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-stagger">
              {semesters.map(entry => (
                <GradeCard key={entry._id} entry={entry} onDelete={() => handleDelete(entry.semester)} />
              ))}
            </div>
          ) : (
            <div className="card">
              <EmptyState
                icon={ChartBarIcon}
                title="No semester data"
                description="Add your past semester grades to calculate your CGPA."
                action={<button onClick={() => setAddOpen(true)} className="btn-primary">Add First Semester</button>}
              />
            </div>
          )}
        </div>
      )}

      {tab === 'chart' && (
        <div className="animate-fade-in">
          {semesters.length > 0 ? (
            <div className="card p-6">
              <h3 className="section-title mb-5">SGPA Trend by Semester</h3>
              <Bar data={chartData} options={chartOptions} height={80} />
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                {[
                  { color: 'bg-success-500', label: 'Outstanding (≥8.5)' },
                  { color: 'bg-brand-500', label: 'Good (7–8.5)' },
                  { color: 'bg-warn-400', label: 'Average (6–7)' },
                  { color: 'bg-danger-500', label: 'Below Average (<6)' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card">
              <EmptyState icon={ChartBarIcon} title="No data to chart" description="Add semester data first." />
            </div>
          )}
        </div>
      )}

      {tab === 'simulate' && (
        <div className="animate-fade-in max-w-2xl">
          <CGPASimulator existingCGPA={cgpa} existingCredits={totalCredits} />
        </div>
      )}

      {addOpen && <SemesterFormModal onClose={() => setAddOpen(false)} />}
    </div>
  );
}
