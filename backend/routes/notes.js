const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth.js');
const Note = require('../models/Note.js');

router.use(authenticateJWT);

// Create Note
router.post('/', async (req, res) => {
  const tenant = req.user.tenant;
  if (tenant.plan === 'free') {
    const notesCount = await Note.countDocuments({ tenant: tenant._id });
    if (notesCount >= 3) return res.status(403).json({ message: 'Upgrade to Pro to create more notes' });
  }

  const note = await Note.create({
    title: req.body.title,
    content: req.body.content,
    tenant: tenant._id,
    author: req.user._id
  });

  res.json(note);
});

// Get all notes
router.get('/', async (req, res) => {
  const notes = await Note.find({ tenant: req.user.tenant._id });
  res.json(notes);
});

// Get note by id
router.get('/:id', async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant._id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// Update note
router.put('/:id', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenant._id },
    { title: req.body.title, content: req.body.content },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// Delete note
router.delete('/:id', async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, tenant: req.user.tenant._id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
});

module.exports = router;
