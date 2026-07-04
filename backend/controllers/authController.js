import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export const registerValidation = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 chars.'),
  body('email').isEmail().withMessage('Valid email required.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password needs uppercase, lowercase and a digit.'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400); throw new Error(errors.array().map(e => e.msg).join(', ')); }

  const { name, email, password, institution, semester } = req.body;
  if (await User.findOne({ email })) { res.status(400); throw new Error('Email already registered.'); }

  const user = await User.create({ name, email, password, institution, semester });
  generateTokenAndSetCookie(res, user._id);

  res.status(201).json({ success: true, user: { _id: user._id, name: user.name, email: user.email, institution: user.institution, semester: user.semester, initials: user.initials } });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400); throw new Error('Invalid credentials.'); }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) { res.status(401); throw new Error('Invalid email or password.'); }

  generateTokenAndSetCookie(res, user._id);
  res.status(200).json({ success: true, user: { _id: user._id, name: user.name, email: user.email, institution: user.institution, semester: user.semester, initials: user.initials } });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { 
    httpOnly: true, 
    expires: new Date(0), 
    secure: true, 
    sameSite: 'none' 
  });
  res.status(200).json({ success: true, message: 'Logged out.' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, user: { _id: user._id, name: user.name, email: user.email, institution: user.institution, semester: user.semester, initials: user.initials, createdAt: user.createdAt } });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  ['name', 'institution', 'semester'].forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });
  await user.save();
  res.status(200).json({ success: true, user: { _id: user._id, name: user.name, email: user.email, institution: user.institution, semester: user.semester, initials: user.initials } });
});
