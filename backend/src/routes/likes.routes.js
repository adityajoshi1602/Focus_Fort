const express = require('express');
const likesController = require('../controllers/likes.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, likesController.toggleLike);
router.get('/check/:type/:id', protect, likesController.checkLike);

module.exports = router;