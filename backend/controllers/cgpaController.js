import asyncHandler from 'express-async-handler';
import CGPAEntry from '../models/CGPAEntry.js';

export const getCGPAData = asyncHandler(async (req, res) => {
  const entries = await CGPAEntry.find({ user: req.user._id }).sort({ semester: 1 });
  let tw = 0, tc = 0;
  entries.forEach(e => { if (e.sgpa && e.totalCredits) { tw += e.sgpa * e.totalCredits; tc += e.totalCredits; } });
  const cgpa = tc > 0 ? parseFloat((tw / tc).toFixed(2)) : 0;
  res.json({ success: true, cgpa, totalCredits: tc, semesters: entries });
});

export const addOrUpdateSemester = asyncHandler(async (req, res) => {
  const { semester, subjects } = req.body;
  if (!semester || !Array.isArray(subjects)) { res.status(400); throw new Error('Semester and subjects[] required.'); }
  let entry = await CGPAEntry.findOne({ user: req.user._id, semester });
  if (entry) { entry.subjects = subjects; await entry.save(); }
  else { entry = await CGPAEntry.create({ user: req.user._id, semester, subjects }); }
  res.json({ success: true, entry });
});

export const deleteSemester = asyncHandler(async (req, res) => {
  const entry = await CGPAEntry.findOneAndDelete({ user: req.user._id, semester: parseInt(req.params.semester) });
  if (!entry) { res.status(404); throw new Error('Semester entry not found.'); }
  res.json({ success: true, message: 'Semester deleted.' });
});

export const simulateCGPA = asyncHandler(async (req, res) => {
  const { existingEntries = [], futureSubjects = [] } = req.body;
  let tw = 0, tc = 0;
  existingEntries.forEach(e => { tw += e.sgpa * e.totalCredits; tc += e.totalCredits; });
  const ftc = futureSubjects.reduce((s, x) => s + x.credits, 0);
  const fws = futureSubjects.reduce((s, x) => s + x.gradePoint * x.credits, 0);
  const futureSGPA = ftc > 0 ? parseFloat((fws / ftc).toFixed(2)) : 0;
  tw += fws; tc += ftc;
  const projectedCGPA = tc > 0 ? parseFloat((tw / tc).toFixed(2)) : 0;
  res.json({ success: true, projectedCGPA, futureSGPA, totalCreditsAfter: tc });
});
