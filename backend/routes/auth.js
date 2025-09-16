const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Login body:", req.body);

  const user = await User.findOne({ email }).populate('tenant');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user._id, tenantId: user.tenant._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    tenantSlug: user.tenant.slug,
    role: user.role
  });
});

module.exports = router;

