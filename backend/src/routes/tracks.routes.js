const express = require('express');
const trackController = require('../controllers/tracks.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', trackController.getTracks);
router.get('/:id', trackController.getTrack);
router.post('/', protect, authorize('creator', 'admin'), trackController.createTrack);

module.exports = router;