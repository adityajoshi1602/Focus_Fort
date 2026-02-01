const likesService = require('../services/likes.service');

// @desc    Toggle like
// @route   POST /api/likes
const toggleLike = async (req, res) => {
  try {
    const { type, id } = req.body;
    if (!type || !id) return res.status(400).json({ message: 'Type and ID required' });

    const result = await likesService.toggleLike(req.user.id, type, id);
    
    // Optionally return new count immediately for UI optimism
    const newCount = await likesService.getLikeCount(type, id);
    
    res.status(200).json({ ...result, count: newCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if liked
// @route   GET /api/likes/check/:type/:id
const checkLike = async (req, res) => {
  try {
    const { type, id } = req.params;
    const liked = await likesService.checkUserLiked(req.user.id, type, id);
    res.status(200).json({ liked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { toggleLike, checkLike };