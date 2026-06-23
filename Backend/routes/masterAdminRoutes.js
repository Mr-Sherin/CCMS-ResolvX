const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// Custom middleware for MasterAdmin
const masterAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'MasterAdmin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a Master Admin' });
  }
};

// @desc    Get all local admins
// @route   GET /api/master/admins
// @access  Private (Master Admin)
router.get('/admins', protect, masterAdmin, async (req, res) => {
  try {
    const admins = await User.find({ role: 'Admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a local admin
// @route   POST /api/master/admins
// @access  Private (Master Admin)
router.post('/admins', protect, masterAdmin, async (req, res) => {
  const { name, email, password, department, staffId } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const adminUser = await User.create({
      name,
      email,
      password,
      role: 'Admin',
      department,
      staffId,
    });

    const obj = adminUser.toObject();
    delete obj.password;
    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Edit a local admin
// @route   PUT /api/master/admins/:id
// @access  Private (Master Admin)
router.put('/admins/:id', protect, masterAdmin, async (req, res) => {
  const { name, email, password, department, staffId } = req.body;

  try {
    const adminUser = await User.findById(req.params.id);

    if (!adminUser || adminUser.role !== 'Admin') {
      return res.status(404).json({ message: 'Admin account not found' });
    }

    if (email && email !== adminUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already taken' });
      }
    }

    adminUser.name = name || adminUser.name;
    adminUser.email = email || adminUser.email;
    adminUser.department = department || adminUser.department;
    adminUser.staffId = staffId || adminUser.staffId;
    
    if (password) {
      adminUser.password = password;
    }

    const updatedAdmin = await adminUser.save();
    
    const obj = updatedAdmin.toObject();
    delete obj.password;
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a local admin
// @route   DELETE /api/master/admins/:id
// @access  Private (Master Admin)
router.delete('/admins/:id', protect, masterAdmin, async (req, res) => {
  try {
    const adminUser = await User.findById(req.params.id);

    if (!adminUser || adminUser.role !== 'Admin') {
      return res.status(404).json({ message: 'Admin account not found' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
