const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, admin } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

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

    // Send email notification to student
    try {
      const message = `Dear ${obj.studentId.name},\n\nThere has been an update to your complaint titled "${obj.title}".\n\nNew Status: ${obj.status}\nResolution Details: ${obj.resolutionDetails || 'N/A'}\n\nPlease log in to the CCMS portal for more details.\n\nRegards,\nCCMS Admin`;
      
      await sendEmail({
        email: obj.studentId.email,
        subject: `Update on your Complaint: ${obj.title}`,
        message: message,
      });
    } catch (emailError) {
      console.error('Email could not be sent:', emailError);
      // Not failing the response if email sending fails
    }

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
