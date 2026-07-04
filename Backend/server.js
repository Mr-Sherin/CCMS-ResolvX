const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');
const masterAdminRoutes = require('./routes/masterAdminRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/master', masterAdminRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Debug Route to check if env variables are loaded (DO NOT RETURN ACTUAL PASSWORDS)
app.get('/api/debug-env', (req, res) => {
  res.json({
    smtpHost: process.env.SMTP_HOST ? process.env.SMTP_HOST : 'NOT SET',
    smtpPort: process.env.SMTP_PORT ? process.env.SMTP_PORT : 'NOT SET',
    useDummyEmail: process.env.USE_DUMMY_EMAIL ? process.env.USE_DUMMY_EMAIL : 'NOT SET',
    dbState: require('mongoose').connection.readyState
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
