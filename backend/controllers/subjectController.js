import asyncHandler from 'express-async-handler';
import Subject from '../models/Subject.js';
import Attendance from '../models/Attendance.js';

export const getSubjects = asyncHandler(async (req, res) => {
  const { semester, active } = req.query;
  const filter = { user: req.user._id };
  if (semester) filter.semester = parseInt(semester);
  if (active !== undefined) filter.isActive = active === 'true';
  const subjects = await Subject.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: subjects.length, subjects });
});

export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, credits, instructor, color, semester } = req.body;
  if (!name || !credits) { res.status(400); throw new Error('Name and credits are required.'); }
  const subject = await Subject.create({ user: req.user._id, name, code, credits, instructor, color, semester: semester || req.user.semester });
  await Attendance.create({ user: req.user._id, subject: subject._id, totalClasses: 0, attended: 0 });
  res.status(201).json({ success: true, subject });
});

export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
  if (!subject) { res.status(404); throw new Error('Subject not found.'); }
  ['name', 'code', 'credits', 'instructor', 'color', 'isActive', 'currentGrade', 'gradePoint'].forEach(f => {
    if (req.body[f] !== undefined) subject[f] = req.body[f];
  });
  await subject.save();
  res.json({ success: true, subject });
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!subject) { res.status(404); throw new Error('Subject not found.'); }
  await Attendance.deleteMany({ subject: subject._id });
  res.json({ success: true, message: 'Subject deleted.' });
});
