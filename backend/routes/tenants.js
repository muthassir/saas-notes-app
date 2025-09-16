const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant.js');
const auth = require('../middleware/auth.js');
const requireAdmin = require('../middleware/requireAdmin.js');

router.post('/:slug/upgrade', auth, requireAdmin, async (req, res) => {
  const tenant = await Tenant.findOne({ slug: req.params.slug });
  if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

  tenant.plan = 'pro';
  await tenant.save();

  res.json({ message: 'Tenant upgraded to Pro', plan: tenant.plan });
});

router.get('/:slug', async (req, res) => {
  const tenant = await Tenant.findOne({ slug: req.params.slug });
  if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
  res.json({ name: tenant.name, slug: tenant.slug, plan: tenant.plan });
});


module.exports = router;
