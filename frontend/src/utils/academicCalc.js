// ─── Grade Point Mapping (10-point scale) ────────────────────────────────────
export const GRADE_POINTS = {
  'O':  10,
  'A+': 9,
  'A':  8,
  'B+': 7,
  'B':  6,
  'C':  5,
  'P':  4,
  'F':  0,
};

export const GRADE_LABELS = Object.keys(GRADE_POINTS);

export const gradeToPoint = (grade) => GRADE_POINTS[grade] ?? 0;
export const pointToGrade = (point) => {
  if (point >= 10) return 'O';
  if (point >= 9)  return 'A+';
  if (point >= 8)  return 'A';
  if (point >= 7)  return 'B+';
  if (point >= 6)  return 'B';
  if (point >= 5)  return 'C';
  if (point >= 4)  return 'P';
  return 'F';
};

// ─── Attendance Logic ─────────────────────────────────────────────────────────
export const ATTENDANCE_THRESHOLD = 75;

export const calcAttendanceStats = (total, attended) => {
  const percentage = total === 0 ? 0 : parseFloat(((attended / total) * 100).toFixed(2));
  const status =
    percentage === 0 && total > 0 ? 'critical' :
    percentage < ATTENDANCE_THRESHOLD ? 'at-risk' :
    percentage >= 90 ? 'excellent' : 'safe';

  // How many more classes can be skipped while staying ≥ 75%
  const safeToSkip = Math.max(0, Math.floor((attended - 0.75 * total) / 0.75));

  // How many consecutive classes must be attended to reach 75%
  const mustAttend = percentage >= ATTENDANCE_THRESHOLD ? 0 :
    Math.max(0, Math.ceil((0.75 * total - attended) / 0.25));

  // Project percentage after attending N more classes
  const projectAttend = (extra) => {
    if (total + extra === 0) return 0;
    return parseFloat(((attended + extra) / (total + extra) * 100).toFixed(2));
  };

  // Project percentage after skipping N more classes
  const projectSkip = (skip) => {
    if (total + skip === 0) return 0;
    return parseFloat((attended / (total + skip) * 100).toFixed(2));
  };

  return { percentage, status, safeToSkip, mustAttend, projectAttend, projectSkip };
};

export const getAttendanceColor = (pct) => {
  if (pct >= 90) return 'text-success-600';
  if (pct >= 75) return 'text-success-500';
  if (pct >= 60) return 'text-warn-500';
  return 'text-danger-500';
};

export const getAttendanceBg = (pct) => {
  if (pct >= 90) return 'bg-success-500';
  if (pct >= 75) return 'bg-success-400';
  if (pct >= 60) return 'bg-warn-400';
  return 'bg-danger-500';
};

// ─── CGPA Logic ───────────────────────────────────────────────────────────────
export const calcSGPA = (subjects) => {
  const tc = subjects.reduce((s, x) => s + x.credits, 0);
  const ws = subjects.reduce((s, x) => s + x.gradePoint * x.credits, 0);
  return tc > 0 ? parseFloat((ws / tc).toFixed(2)) : 0;
};

export const calcCGPA = (semesters) => {
  const tc = semesters.reduce((s, x) => s + (x.totalCredits || 0), 0);
  const ws = semesters.reduce((s, x) => s + (x.sgpa || 0) * (x.totalCredits || 0), 0);
  return tc > 0 ? parseFloat((ws / tc).toFixed(2)) : 0;
};

export const getCGPALabel = (cgpa) => {
  if (cgpa >= 9)   return { label: 'Outstanding', color: 'text-success-600', bg: 'bg-success-50' };
  if (cgpa >= 8)   return { label: 'Excellent', color: 'text-success-500', bg: 'bg-success-50' };
  if (cgpa >= 7)   return { label: 'Very Good', color: 'text-brand-600', bg: 'bg-brand-50' };
  if (cgpa >= 6)   return { label: 'Good', color: 'text-brand-500', bg: 'bg-brand-50' };
  if (cgpa >= 5)   return { label: 'Average', color: 'text-warn-500', bg: 'bg-warn-50' };
  return { label: 'Needs Improvement', color: 'text-danger-500', bg: 'bg-danger-50' };
};

// ─── Formatting ───────────────────────────────────────────────────────────────
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};
