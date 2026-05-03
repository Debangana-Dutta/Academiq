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

// Register ChartJS components for the SGPA Trend chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CGPAPage() {
  const { cgpaData, fetchCGPA, deleteSemester, loadingStates } = useAcademic();
  const [addOpen, setAddOpen] = useState(false);
  const [tab, setTab] = useState('overview');

  // Fetch CGPA data on initial component mount
  useEffect(() => { 
    fetchCGPA(); 
  }, []);

  // Show a full-page loader if data is fetching and the list is empty
  if (loadingStates.cgpa && !cgpaData.semesters.length) return <PageLoader />;

  const { cgpa, semesters, totalCredits } = cgpaData;
  const cgpaLabel = getCGPALabel(cgpa);

  const handleDelete = async (semester) => {
    if (!window.confirm(`Delete semester ${semester} data? This cannot be undone.`)) return;
    try { 
      await deleteSemester(semester); 
      toast.success(`Semester ${semester} deleted`); 
    } catch (e) { 
      toast.error(e.message); 
    }
  };

  // Chart configuration for the SGPA trend visualization
  const chartData = {
    labels: semesters.map(s => `Sem ${s.semester}`),
    datasets: [{
      label: 'SGPA',
      data: semesters.map(s => s.sgpa),
      // Dynamic coloring based on performance
      backgroundColor: semesters.map(s => 
        s.sgpa >= 8.5 ? '#10b981' : // Emerald-500
        s.sgpa >= 7 ? '#6366f1' :   // Brand-500
        s.sgpa >= 6 ? '#f59e0b' :   // Amber-500
        '#ef4444'                   // Red-500
      ),
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the height prop on <Bar /> to work better
    plugins: { 
      legend: { display: false }, 
      tooltip: { callbacks: { label: (c) => ` SGPA: ${c.raw?.toFixed(2)}` } } 
    },
    scales: {
      y: { min: 0, max: 10, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  return (
    <div className="page-container max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">CGPA Planner</h2>
          <p className="text-slate-500 mt-1">Track historical grades and simulate future performance</p>
        </div>
        <button 
          onClick={() => setAddOpen(true)} 
          className="btn-primary flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-transform active:scale-95"
        >
          <PlusIcon className="w-5 h-5" /> 
          <span>Add Semester</span>
        </button>
      </div>

      {/* CGPA Hero Section */}
      {cgpa > 0 && (
        <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-brand-500/10 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-2">Cumulative Grade Point Average</p>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black tabular-nums tracking-tighter">{cgpa.toFixed(2)}</span>
                <span className="text-white/50 text-xl font-bold">/ 10.0</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold tracking-wide">{cgpaLabel.label}</span>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-32 bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/10">
                <p className="text-3xl font-black">{semesters.length}</p>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Semesters</p>
              </div>
              <div className="flex-1 md:w-32 bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/10">
                <p className="text-3xl font-black">{totalCredits}</p>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Credits</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl mb-8 w-fit border border-slate-200">
        {[['overview', 'Semesters'], ['chart', 'SGPA Chart'], ['simulate', 'Simulator']].map(([id, label]) => (
          <button 
            key={id} 
            onClick={() => setTab(id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              tab === id 
                ? 'bg-white text-brand-600 shadow-md shadow-slate-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content Areas */}
      <div className="min-h-[400px]">
        {tab === 'overview' && (
          <div className="animate-fade-in">
            {semesters.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger">
                {semesters.map(entry => (
                  <GradeCard key={entry._id} entry={entry} onDelete={() => handleDelete(entry.semester)} />
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <EmptyState
                  icon={ChartBarIcon}
                  title="No semester data"
                  description="Your academic journey is just beginning. Add your past semester grades to visualize your progress."
                  action={
                    <button onClick={() => setAddOpen(true)} className="btn-primary mt-4">
                      Add First Semester
                    </button>
                  }
                />
              </div>
            )}
          </div>
        )}

        {tab === 'chart' && (
          <div className="animate-fade-in">
            {semesters.length > 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
                  SGPA Trend Analysis
                </h3>
                <div className="h-[350px]">
                  <Bar data={chartData} options={chartOptions} />
                </div>
                
                {/* Chart Legend */}
                <div className="flex items-center gap-6 mt-10 pt-6 border-t border-slate-50 flex-wrap">
                  {[
                    { color: 'bg-emerald-500', label: 'Outstanding (≥8.5)' },
                    { color: 'bg-brand-500', label: 'Good (7–8.5)' },
                    { color: 'bg-amber-500', label: 'Average (6–7)' },
                    { color: 'bg-red-500', label: 'Below Average (<6)' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState icon={ChartBarIcon} title="Insufficient Data" description="Add at least one semester to view your performance charts." />
            )}
          </div>
        )}

        {tab === 'simulate' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <CGPASimulator existingCGPA={cgpa} existingCredits={totalCredits} />
          </div>
        )}
      </div>

      {/* Modal - Ensure you applied the scroll fix inside SemesterFormModal */}
      {addOpen && <SemesterFormModal onClose={() => setAddOpen(false)} />}
    </div>
  );
}