const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/auth.controller');

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post(
  '/signup',
  [
    check('full_name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  handleValidationErrors, // <--- Stops the request if validation fails
  authController.signup
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  handleValidationErrors, // <--- Stops the request if validation fails
  authController.login
);

module.exports = router;