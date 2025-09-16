const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const noteRoutes = require('./routes/notes.js');
const tenantRoutes = require('./routes/tenants.js');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);
app.use('/tenants', tenantRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3001, () =>
      console.log(`Server running on port ${process.env.PORT || 3001}`)
    );
  })
  .catch(err => console.error(err));
