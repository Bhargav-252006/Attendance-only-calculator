const express = require('express');
const router = express.Router();
const { 
  calculateAttendance,
  getSchedule
} = require('../controllers/attendanceController');

// Get schedule for a department and semester
router.get('/schedule', getSchedule);

// Calculate attendance
router.post('/calculate', calculateAttendance);

module.exports = router; 