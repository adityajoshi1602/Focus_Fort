const supabase = require('../config/supabase');

// --- Helper: Verify course ownership ---
const verifyCourseOwnership = async (courseId, userId) => {
  const { data } = await supabase
    .from('courses')
    .select('creator_id')
    .eq('id', courseId)
    .single();
  return data && data.creator_id === userId;
};

/**
 * Create a Module (Container for lessons)
 */
const createModule = async (moduleData, userId) => {
  const { course_id, title, order_number } = moduleData;
  
  const isOwner = await verifyCourseOwnership(course_id, userId);
  if (!isOwner) throw new Error('Not authorized to add modules to this course');

  const { data, error } = await supabase
    .from('course_modules')
    .insert([{ course_id, title, order_number }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Create a Lesson
 */
const createLesson = async (lessonData, userId) => {
  const { course_id, module_id, title, description, video_url, thumbnail_url, duration, order_number } = lessonData;

  const isOwner = await verifyCourseOwnership(course_id, userId);
  if (!isOwner) throw new Error('Not authorized to add lessons to this course');

  const { data, error } = await supabase
    .from('lessons')
    .insert([{
      course_id,
      module_id,
      title,
      description,
      video_url,
      thumbnail_url,
      duration,     // Int (seconds) or String
      order_number
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Update Lesson
 */
const updateLesson = async (lessonId, userId, updateData) => {
  // Check lesson existence and course ownership
  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id')
    .eq('id', lessonId)
    .single();

  if (!lesson) throw new Error('Lesson not found');

  const isOwner = await verifyCourseOwnership(lesson.course_id, userId);
  if (!isOwner) throw new Error('Not authorized to update this lesson');

  const { data, error } = await supabase
    .from('lessons')
    .update(updateData)
    .eq('id', lessonId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Delete Lesson
 */
const deleteLesson = async (lessonId, userId) => {
  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id')
    .eq('id', lessonId)
    .single();

  if (!lesson) throw new Error('Lesson not found');
  
  const isOwner = await verifyCourseOwnership(lesson.course_id, userId);
  if (!isOwner) throw new Error('Not authorized to delete this lesson');

  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
  if (error) throw new Error(error.message);
  
  return { message: 'Lesson deleted' };
};

module.exports = { createModule, createLesson, updateLesson, deleteLesson };