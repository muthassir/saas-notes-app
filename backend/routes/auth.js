// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User.js');

// // POST /auth/login
// router.post('/login', async (req, res) => {
//   try {
//     console.log("Login body:", req.body); // 👈 log the incoming payload

//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Find user and populate tenant
//     const user = await User.findOne({ email }).populate('tenant');
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials (user not found)' });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials (wrong password)' });
//     }

//     // Create JWT
//     const token = jwt.sign(
//       { userId: user._id, tenantId: user.tenant?._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         tenant: user.tenant?.slug || null,
//       },
//     });

//   } catch (err) {
//     console.error("Login error:", err.message, err.stack);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// module.exports = router;





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

