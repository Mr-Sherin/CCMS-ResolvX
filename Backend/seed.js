require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const User = require('./models/User');

const seedMasterAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'resolvx007@gmail.com';
    const password = 'ResolvX007';

    // Check if it already exists
    const existing = await User.findOne({ email });
    if (existing) {
      existing.password = password;
      existing.role = 'MasterAdmin';
      await existing.save();
      console.log('Master Admin updated!');
    } else {
      await User.create({
        name: 'Master Admin',
        email,
        password,
        role: 'MasterAdmin',
      });
      console.log('Master Admin created!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedMasterAdmin();
