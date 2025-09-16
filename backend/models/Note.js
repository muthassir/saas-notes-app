const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Useryards' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', NoteSchema);
