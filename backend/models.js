const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TenantSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  plan: { type: String, enum: ['free','pro'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});
const Tenant = mongoose.model('Tenant', TenantSchema);

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin','Member'], default: 'Member' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidate){
  return bcrypt.compare(candidate, this.password);
}

const User = mongoose.model('Useryards', UserSchema);

const NoteSchema = new mongoose.Schema({
  tenant: { type: String, required: true }, // tenant slug for strict isolation
  title: String,
  content: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Useryards' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});
const Note = mongoose.model('Note', NoteSchema);

module.exports = { Tenant, User, Note };
