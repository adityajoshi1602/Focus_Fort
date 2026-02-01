const express = require('express');
const commentsController = require('../controllers/comments.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:type/:id', commentsController.getComments);
router.post('/', protect, commentsController.addComment);
router.delete('/:id', protect, commentsController.deleteComment);

module.exports = router;