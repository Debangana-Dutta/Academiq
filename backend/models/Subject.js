import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: [true, 'Subject name is required.'], trim: true, maxlength: 100 },
  code: { type: String, trim: true, uppercase: true, maxlength: 20, default: '' },
  credits: { type: Number, required: [true, 'Credits are required.'], min: 0.5, max: 10 },
  instructor: { type: String, trim: true, maxlength: 100, default: '' },
  color: { type: String, default: '#6366f1' },
  semester: { type: Number, min: 1, max: 12, required: true },
  isActive: { type: Boolean, default: true },
  currentGrade: { type: Number, min: 0, max: 10, default: null },
  gradePoint: { type: String, enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F', null], default: null },
}, { timestamps: true });

subjectSchema.index({ user: 1, semester: 1 });
export default mongoose.model('Subject', subjectSchema);
