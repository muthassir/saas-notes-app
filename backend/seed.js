// require('dotenv').config();
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const connectDB = require('./config/db.js');
// const Tenant = require('./models/Tenant.js');
// const User = require('./models/User.js');

// const seed = async () => {
//   await connectDB();

//   // Clear old data
//   await Tenant.deleteMany({});
//   await User.deleteMany({});

//   // Create tenants
//   const acme = await Tenant.create({ name: 'Acme', slug: 'acme', plan: 'free' });
//   const globex = await Tenant.create({ name: 'Globex', slug: 'globex', plan: 'free' });

//   // Password hash
//   const passwordHash = await bcrypt.hash('password', 10);

//   // Create users
//   await User.create([
//     { email: 'admin@acme.test', password: passwordHash, role: 'admin', tenant: acme._id },
//     { email: 'user@acme.test', password: passwordHash, role: 'member', tenant: acme._id },
//     { email: 'admin@globex.test', password: passwordHash, role: 'admin', tenant: globex._id },
//     { email: 'user@globex.test', password: passwordHash, role: 'member', tenant: globex._id }
//   ]);

//   console.log('✅ Database seeded with tenants and users');
//   mongoose.disconnect();
// };

// seed();
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
