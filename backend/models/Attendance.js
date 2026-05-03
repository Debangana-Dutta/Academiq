import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'cancelled', 'medical'], required: true },
  notes: { type: String, maxlength: 200, default: '' },
});

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  totalClasses: { type: Number, default: 0, min: 0 },
  attended: { type: Number, default: 0, min: 0 },
  logs: [logSchema],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

attendanceSchema.virtual('percentage').get(function () {
  if (this.totalClasses === 0) return 0;
  return parseFloat(((this.attended / this.totalClasses) * 100).toFixed(2));
});

attendanceSchema.virtual('safeToSkip').get(function () {
  const canSkip = Math.floor((this.attended - 0.75 * this.totalClasses) / 0.75);
  return Math.max(0, canSkip);
});

attendanceSchema.virtual('mustAttend').get(function () {
  if (this.totalClasses === 0 || this.percentage >= 75) return 0;
  const needed = Math.ceil((0.75 * this.totalClasses - this.attended) / 0.25);
  return Math.max(0, needed);
});

attendanceSchema.index({ user: 1, subject: 1 }, { unique: true });
export default mongoose.model('Attendance', attendanceSchema);
