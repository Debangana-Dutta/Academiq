import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { calcAttendanceStats } from '../../utils/academicCalc';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AttendanceChart({ attendanceData }) {
  if (!attendanceData.length) return null;

  const safe     = attendanceData.filter(r => r.percentage >= 75).length;
  const atRisk   = attendanceData.filter(r => r.percentage > 0 && r.percentage < 75).length;
  const critical = attendanceData.filter(r => r.percentage === 0 && r.totalClasses > 0).length;
  const untouched = attendanceData.filter(r => r.totalClasses === 0).length;

  const data = {
    labels: ['Safe (≥75%)', 'At Risk', 'Critical (0%)', 'No Data'],
    datasets: [{
      data: [safe, atRisk, critical, untouched],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#e2e8f0'],
      borderColor:     ['#059669', '#d97706', '#dc2626', '#cbd5e1'],
      borderWidth: 2,
      hoverOffset: 4,
    }],
  };

  const options = {
    responsive: true,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} subject${ctx.raw !== 1 ? 's' : ''}`,
        },
      },
    },
  };

  const total = attendanceData.length;

  return (
    <div className="card p-6">
      <h3 className="section-title mb-4">Attendance Overview</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">{total}</span>
            <span className="text-xs text-slate-400 font-medium">subjects</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {[
            { label: 'Safe', count: safe,     color: 'bg-success-500' },
            { label: 'At Risk', count: atRisk, color: 'bg-warn-400' },
            { label: 'Critical', count: critical, color: 'bg-danger-500' },
            { label: 'No Data', count: untouched, color: 'bg-slate-300' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
              <span className="text-sm text-slate-600 flex-1">{item.label}</span>
              <span className="text-sm font-bold text-slate-800 tabular-nums">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
