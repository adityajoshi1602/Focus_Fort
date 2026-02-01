const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// ✅ Import must match the export names exactly
const { getMyEnrollments, enrollCourse } = require('../controllers/enrollments.controller');

// Read (Get my courses)
router.get('/', protect, getMyEnrollments);

// Create (Enroll in a course) - This was the line causing the error
router.post('/', protect, enrollCourse);

module.exports = router;