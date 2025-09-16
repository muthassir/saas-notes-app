const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('./models/Tenant.js');
const User = require('./models/User.js');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const tenants = [
    { name: 'Acme', slug: 'acme' },
    { name: 'Globex', slug: 'globex' }
  ];

  for (let t of tenants) {
    let tenant = await Tenant.findOne({ slug: t.slug });
    if (!tenant) tenant = await Tenant.create(t);

    const users = [
      { email: `admin@${t.slug}.test`, role: 'admin' },
      { email: `user@${t.slug}.test`, role: 'member' }
    ];

    for (let u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create({
          email: u.email,
          password: await bcrypt.hash('password', 10),
          role: u.role,
          tenant: tenant._id
        });
        console.log(`Created ${u.email}`);
      }
    }
  }

  console.log('Seeding complete');
  process.exit();
}

seed();
