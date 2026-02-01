const express = require('express');
const upload = require('../middleware/upload.middleware');
const uploadController = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

// Public uploads (Authenticated users)
router.post('/avatar', protect, upload.single('file'), uploadController.uploadAvatar);

// Creator uploads
router.post('/short-video', protect, authorize('creator', 'admin'), upload.single('file'), uploadController.uploadShortVideo);
router.post('/short-thumbnail', protect, authorize('creator', 'admin'), upload.single('file'), uploadController.uploadShortThumbnail);
router.post('/course-video', protect, authorize('creator', 'admin'), upload.single('file'), uploadController.uploadCourseVideo);
router.post('/course-thumbnail', protect, authorize('creator', 'admin'), upload.single('file'), uploadController.uploadCourseThumbnail);

module.exports = router;