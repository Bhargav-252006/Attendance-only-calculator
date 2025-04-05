const { Attendance, Schedule } = require('../../models/Attendance');

// Function to round numbers to two decimal places
function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

// Function to calculate required classes
function calculateRequiredClasses(total, present, required) {
  if (required <= (present / total) * 100) {
    return 0;
  }
  return Math.ceil((required * total - 100 * present) / (100 - required));
}

// @desc    Calculate attendance data
// @route   POST /api/attendance/calculate
// @access  Public
const calculateAttendance = async (req, res) => {
  try {
    const {
      totalClasses,
      presentClasses,
      requiredPercentage,
      currentPercentage,
      classesPerWeek,
      lastUpdatedDay,
      requiredClasses,
      semester,
      department,
      section
    } = req.body;

    // Validate required fields
    if (!totalClasses || !presentClasses || !requiredPercentage || !currentPercentage || !semester || !department || !section) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate number formats
    if (isNaN(totalClasses) || isNaN(presentClasses) || isNaN(requiredPercentage) || isNaN(currentPercentage)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid number format in one or more fields'
      });
    }

    // Validate section based on department
    if (department === 'CSE' && !['A', 'B', 'C', 'D', 'E'].includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section for CSE department. Must be A, B, C, D, or E.'
      });
    } else if (department === 'CSM' && !['A', 'B', 'C'].includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section for CSM department. Must be A, B, or C.'
      });
    } else if (!['A', 'B'].includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section. Must be A or B.'
      });
    }

    // Create attendance record
    const attendance = new Attendance({
      totalClasses: parseInt(totalClasses),
      presentClasses: parseInt(presentClasses),
      requiredPercentage: parseFloat(requiredPercentage),
      currentPercentage: parseFloat(currentPercentage),
      classesPerWeek: {
        monday: parseInt(classesPerWeek.monday),
        tuesday: parseInt(classesPerWeek.tuesday),
        wednesday: parseInt(classesPerWeek.wednesday),
        thursday: parseInt(classesPerWeek.thursday),
        friday: parseInt(classesPerWeek.friday),
        saturday: parseInt(classesPerWeek.saturday)
      },
      lastUpdatedDay: parseInt(lastUpdatedDay),
      requiredClasses: parseInt(requiredClasses),
      semester,
      department,
      section
    });

    await attendance.save();

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error calculating attendance:', error);
    // Check if it's a Mongoose validation error
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: messages.join(', ')
        });
    }
    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Error calculating attendance',
      error: error.message
    });
  }
};

// @desc    Get schedule for a department and semester
// @route   GET /api/attendance/schedule
// @access  Public
const getSchedule = async (req, res) => {
  try {
    const { department, semester, section } = req.query;
    
    if (!department || !semester || !section) {
      return res.status(400).json({ message: 'Please provide department, semester, and section' });
    }
    
    // Get schedule from database - now each document corresponds to a specific department-semester-section
    const schedule = await Schedule.findOne({ department, semester, section });
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found for the specified department, semester, and section' });
    }
    
    res.status(200).json({
      department: schedule.department,
      semester: schedule.semester,
      section: schedule.section,
      classesPerWeek: schedule.classesPerWeek
    });
  } catch (error) {
    console.error('Schedule fetch error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  calculateAttendance,
  getSchedule
}; 