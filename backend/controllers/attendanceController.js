import asyncHandler from 'express-async-handler';
import Attendance from '../models/Attendance.js';
import Subject from '../models/Subject.js';

const enrich = (r) => ({ ...r.toJSON(), percentage: r.percentage, safeToSkip: r.safeToSkip, mustAttend: r.mustAttend });

export const getAllAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ user: req.user._id }).populate('subject', 'name code color credits');
  res.json({ success: true, attendance: records.map(enrich) });
});

export const logAttendance = asyncHandler(async (req, res) => {
  const { subjectId, status, date, notes } = req.body;
  if (!subjectId || !status) { res.status(400); throw new Error('SubjectId and status required.'); }

  const subject = await Subject.findOne({ _id: subjectId, user: req.user._id });
  if (!subject) { res.status(404); throw new Error('Subject not found.'); }

  let record = await Attendance.findOne({ user: req.user._id, subject: subjectId });
  if (!record) record = new Attendance({ user: req.user._id, subject: subjectId, totalClasses: 0, attended: 0 });

  record.logs.push({ date: date || new Date(), status, notes: notes || '' });
  if (status !== 'cancelled') {
    record.totalClasses += 1;
    if (status === 'present' || status === 'medical') record.attended += 1;
  }

  await record.save();
  res.json({ success: true, record: enrich(record) });
});

export const setManualAttendance = asyncHandler(async (req, res) => {
  const { totalClasses, attended } = req.body;
  if (attended > totalClasses) { res.status(400); throw new Error('Attended cannot exceed total.'); }
  const record = await Attendance.findOne({ user: req.user._id, subject: req.params.subjectId });
  if (!record) { res.status(404); throw new Error('Attendance record not found.'); }
  record.totalClasses = totalClasses;
  record.attended = attended;
  await record.save();
  res.json({ success: true, record: enrich(record) });
});

export const getAttendanceSummary = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ user: req.user._id });
  const summary = {
    totalSubjects: records.length,
    safe: records.filter(r => r.percentage >= 75).length,
    atRisk: records.filter(r => r.percentage > 0 && r.percentage < 75).length,
    critical: records.filter(r => r.percentage === 0 && r.totalClasses > 0).length,
    overallPercentage: records.length > 0
      ? parseFloat((records.reduce((s, r) => s + r.percentage, 0) / records.length).toFixed(2)) : 0,
  };
  res.json({ success: true, summary });
});
