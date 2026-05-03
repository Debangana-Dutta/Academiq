import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  subjectName: { type: String, required: true, trim: true },
  credits: { type: Number, required: true, min: 0.5, max: 10 },
  gradePoint: { type: Number, required: true, min: 0, max: 10 },
});

const cgpaEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  semester: { type: Number, required: true, min: 1, max: 12 },
  subjects: [gradeSchema],
  sgpa: { type: Number, min: 0, max: 10 },
  totalCredits: { type: Number, min: 0 },
  isLocked: { type: Boolean, default: false },
}, { timestamps: true });

cgpaEntrySchema.pre('save', function (next) {
  if (this.subjects && this.subjects.length > 0) {
    const tc = this.subjects.reduce((s, x) => s + x.credits, 0);
    const ws = this.subjects.reduce((s, x) => s + x.gradePoint * x.credits, 0);
    this.sgpa = parseFloat((ws / tc).toFixed(2));
    this.totalCredits = tc;
  }
  next();
});

cgpaEntrySchema.index({ user: 1, semester: 1 }, { unique: true });
export default mongoose.model('CGPAEntry', cgpaEntrySchema);
