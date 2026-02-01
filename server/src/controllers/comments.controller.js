const commentsService = require('../services/comments.service');

// @desc    Get comments
// @route   GET /api/comments/:type/:id
const getComments = async (req, res) => {
  try {
    const { type, id } = req.params;
    const comments = await commentsService.getComments(type, id);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment
// @route   POST /api/comments
const addComment = async (req, res) => {
  try {
    const { type, id, content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });

    const comment = await commentsService.addComment(req.user.id, type, id, content);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const result = await commentsService.deleteComment(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = { getComments, addComment, deleteComment };