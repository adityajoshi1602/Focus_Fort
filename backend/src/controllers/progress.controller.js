const progressService = require('../services/progress.service');

// @desc    Update lesson progress
// @route   POST /api/progress
const updateProgress = async (req, res) => {
  try {
    const { lesson_id, completed } = req.body;
    if (!lesson_id) return res.status(400).json({ message: 'Lesson ID required' });

    const result = await progressService.updateProgress(
      req.user.id, 
      lesson_id, 
      completed === undefined ? true : completed
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get progress for a specific course
// @route   GET /api/progress/:courseId
const getProgress = async (req, res) => {
  try {
    const result = await progressService.getCourseProgress(req.user.id, req.params.courseId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProgress, getProgress };