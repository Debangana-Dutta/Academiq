import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
  title: { type: String, required: [true, 'Title is required.'], trim: true, maxlength: 150 },
  content: { type: String, required: [true, 'Content is required.'], maxlength: 50000 },
  tags: { type: [String], default: [], validate: [(v) => v.length <= 10, 'Max 10 tags.'] },
  isPinned: { type: Boolean, default: false },
  color: { type: String, enum: ['slate', 'indigo', 'emerald', 'amber', 'rose', 'violet'], default: 'slate' },
}, { timestamps: true });

noteSchema.index({ title: 'text', content: 'text', tags: 'text' });
noteSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });
export default mongoose.model('Note', noteSchema);
