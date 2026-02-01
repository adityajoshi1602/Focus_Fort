const express = require('express');
const progressController = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', progressController.updateProgress);
router.get('/:courseId', progressController.getProgress);

module.exports = router;