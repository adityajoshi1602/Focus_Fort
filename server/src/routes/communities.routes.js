const express = require('express');
const communityController = require('../controllers/communities.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', communityController.getCommunities);
router.post('/:id/join', protect, communityController.join);

module.exports = router;