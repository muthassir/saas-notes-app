// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   email: { type: String, unique: true },
//   password: String,
//   role: { type: String, enum: ['admin', 'member'], default: 'member' },
//   tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
// });

// module.exports = mongoose.model('Useryards', UserSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }
});

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Useryards', UserSchema);
