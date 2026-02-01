const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createShort, getAllShorts } = require('../controllers/shorts.controller');

// Public: Get all shorts (Feed)
router.get('/', getAllShorts);

// Protected: Upload a short (Only logged in users)
router.post('/', protect, createShort);

module.exports = router;