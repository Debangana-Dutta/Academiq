import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required.'], trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: [true, 'Email is required.'], unique: true, lowercase: true, trim: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Provide a valid email.'] },
  password: { type: String, required: [true, 'Password is required.'], minlength: [8, 'Password min 8 chars.'], select: false },
  institution: { type: String, trim: true, maxlength: 100, default: '' },
  semester: { type: Number, min: 1, max: 12, default: 1 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

userSchema.virtual('initials').get(function () {
  return this.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

export default mongoose.model('User', userSchema);
