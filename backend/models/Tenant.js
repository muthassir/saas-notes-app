// const mongoose = require('mongoose');

// const TenantSchema = new mongoose.Schema({
//   name: String,
//   slug: { type: String, unique: true },
//   plan: { type: String, enum: ['free','pro'], default: 'free' },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Tenant', TenantSchema);

const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', TenantSchema);
