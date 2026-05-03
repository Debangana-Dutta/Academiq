import asyncHandler from 'express-async-handler';
import Note from '../models/Note.js';

export const getNotes = asyncHandler(async (req, res) => {
  const { search, subject, tag, color } = req.query;
  const filter = { user: req.user._id };
  if (subject) filter.subject = subject;
  if (color) filter.color = color;
  if (tag) filter.tags = { $in: [tag] };
  if (search) filter.$text = { $search: search };
  const notes = await Note.find(filter).populate('subject', 'name color code').sort({ isPinned: -1, updatedAt: -1 }).limit(100);
  res.json({ success: true, count: notes.length, notes });
});

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, subject, tags, color, isPinned } = req.body;
  if (!title || !content) { res.status(400); throw new Error('Title and content required.'); }
  const note = await Note.create({ user: req.user._id, title, content, subject: subject || null, tags: tags || [], color: color || 'slate', isPinned: isPinned || false });
  res.status(201).json({ success: true, note });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) { res.status(404); throw new Error('Note not found.'); }
  ['title', 'content', 'tags', 'color', 'isPinned', 'subject'].forEach(f => { if (req.body[f] !== undefined) note[f] = req.body[f]; });
  await note.save();
  res.json({ success: true, note });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) { res.status(404); throw new Error('Note not found.'); }
  res.json({ success: true, message: 'Note deleted.' });
});
