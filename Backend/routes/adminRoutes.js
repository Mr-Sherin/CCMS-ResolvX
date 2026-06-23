const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all complaints with optional date filter
// @route   GET /api/admin/complaints
// @access  Private (Admin)
router.get('/complaints', protect, admin, async (req, res) => {
  try {
    let query = {};
    
    if (req.query.date) {
      const targetDate = new Date(req.query.date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate() + 1);
      
      query.createdAt = {
        $gte: targetDate,
        $lt: nextDay
      };
    }

    const complaints = await Complaint.find(query)
      .populate('studentId', 'name email role')
      .sort({ createdAt: -1 });

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

// @desc    Update complaint status
// @route   PUT /api/admin/status/:id
// @access  Private (Admin)
router.put('/status/:id', protect, admin, async (req, res) => {
  const { status, resolutionDetails } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Please provide status' });
    }

    complaint.status = status;
    
    if (resolutionDetails !== undefined) {
      complaint.resolutionDetails = resolutionDetails;
    }

    if (status === 'Resolved') {
      complaint.resolvedDate = new Date();
    } else {
      complaint.resolvedDate = undefined;
    }

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

module.exports = router;
