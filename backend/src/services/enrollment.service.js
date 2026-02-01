const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getMyEnrollments, enrollCourse } = require('../controllers/enrollments.controller');

router.get('/', protect, getMyEnrollments);
router.post('/', protect, enrollCourse);

module.exports = router;