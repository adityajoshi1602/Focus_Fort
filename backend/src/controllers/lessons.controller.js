const lessonService = require('../services/lesson.service');
const { validationResult } = require('express-validator');

// @desc    Create a module
// @route   POST /api/lessons/modules
const createModule = async (req, res) => {
  try {
    const module = await lessonService.createModule(req.body, req.user.id);
    res.status(201).json(module);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// @desc    Create a lesson
// @route   POST /api/lessons
const createLesson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const lesson = await lessonService.createLesson(req.body, req.user.id);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
const updateLesson = async (req, res) => {
  try {
    const lesson = await lessonService.updateLesson(req.params.id, req.user.id, req.body);
    res.status(200).json(lesson);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
const deleteLesson = async (req, res) => {
  try {
    const result = await lessonService.deleteLesson(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = { createModule, createLesson, updateLesson, deleteLesson };