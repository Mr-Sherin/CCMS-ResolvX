const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get complaint stats
// @route   GET /api/complaints/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Student') {
      filter.studentId = req.user._id;
    }

    const complaints = await Complaint.find(filter);

    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;

    const categories = {
      Classroom: 0,
      Laboratory: 0,
      Hostel: 0,
      Library: 0,
      'Internet/Wi-Fi': 0,
      Electrical: 0,
      'Water Supply': 0,
      Cleanliness: 0,
      Other: 0,
    };

    complaints.forEach((c) => {
      if (categories[c.category] !== undefined) {
        categories[c.category]++;
      } else {
        categories.Other++;
      }
    });

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
router.post('/', protect, async (req, res) => {
  const { title, description, category, location } = req.body;

  try {
    const complaint = new Complaint({
      studentId: req.user._id,
      title,
      description,
      category,
      location,
    });

    const createdComplaint = await complaint.save();
    
    // Populate createdBy to match frontend expectations
    await createdComplaint.populate('studentId', 'name email role');
    const responseObj = createdComplaint.toObject();
    responseObj.createdBy = responseObj.studentId;
    responseObj.createdDate = responseObj.createdAt;
    
    res.status(201).json(responseObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all complaints (Student)
// @route   GET /api/complaints
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let complaints = await Complaint.find({ studentId: req.user._id })
      .populate('studentId', 'name email role')
      .sort({ createdAt: -1 });
      
    // Map data for frontend
    const mapped = complaints.map(c => {
      const obj = c.toObject();
      obj.createdBy = obj.studentId;
      obj.createdDate = obj.createdAt;
      return obj;
    });
      
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all complaints for Admin (with date filter)
// @route   GET /api/admin/complaints
// @access  Private (Admin)
// We will place this in the admin routes later, but since frontend calls /admin/complaints, let's map it in server.js

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'studentId',
      'name email role'
    );

    if (complaint) {
      if (
        complaint.studentId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin' && req.user.role !== 'MasterAdmin'
      ) {
        return res.status(401).json({ message: 'Not authorized to view this complaint' });
      }
      
      const obj = complaint.toObject();
      obj.createdBy = obj.studentId;
      obj.createdDate = obj.createdAt;
      
      res.json(obj);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Edit complaint
// @route   PUT /api/complaints/:id
// @access  Private (Student only if Pending)
router.put('/:id', protect, async (req, res) => {
  const { title, category, description, location } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this complaint' });
    }

    if (complaint.status !== 'Pending') {
      return res.status(400).json({ message: 'Complaint is already under review or resolved and cannot be edited.' });
    }

    complaint.title = title || complaint.title;
    complaint.category = category || complaint.category;
    complaint.description = description || complaint.description;
    complaint.location = location || complaint.location;

    const updatedComplaint = await complaint.save();
    
    await updatedComplaint.populate('studentId', 'name email role');
    const obj = updatedComplaint.toObject();
    obj.createdBy = obj.studentId;
    obj.createdDate = obj.createdAt;
    
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Student/Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const isAdmin = req.user.role === 'Admin' || req.user.role === 'MasterAdmin';

    if (!isAdmin && complaint.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    if (!isAdmin && complaint.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot delete complaint once processing begins.' });
    }

    await Complaint.deleteOne({ _id: req.params.id });
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
