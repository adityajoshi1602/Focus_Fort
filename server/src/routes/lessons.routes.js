const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const lessonController = require('../controllers/lessons.controller');

const router = express.Router();

// Apply protection to all lesson routes
router.use(protect);
router.use(authorize('creator', 'admin'));

// Module routes
router.post('/modules', lessonController.createModule);

// Lesson routes
router.post(
  '/',
  [
    check('course_id', 'Course ID is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('video_url', 'Video URL is required').not().isEmpty(),
  ],
  lessonController.createLesson
);

router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;