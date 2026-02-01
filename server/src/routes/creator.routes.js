const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
// const { isAdmin } = require('../middleware/admin.middleware'); // Comment out if you don't have this file yet

const creatorController = require('../controllers/creator.controller');

// User Route
router.post('/apply', protect, creatorController.apply);

// Admin Routes (We will fix "isAdmin" middleware later, for now just protect)
router.get('/applications', protect, creatorController.getApplications);
router.post('/applications/:id/review', protect, creatorController.reviewApplication);

module.exports = router;