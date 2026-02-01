const supabase = require('../config/supabase');

/**
 * Update lesson progress (Mark complete)
 */
const updateProgress = async (userId, lessonId, completed) => {
  // 1. Get lesson info to find course
  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id')
    .eq('id', lessonId)
    .single();
    
  if (!lesson) throw new Error('Lesson not found');

  // 2. Find the enrollment ID
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', lesson.course_id)
    .single();

  if (!enrollment) throw new Error('User is not enrolled in this course');

  // 3. Upsert progress (Insert or Update)
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      enrollment_id: enrollment.id,
      lesson_id: lessonId,
      completed: completed,
      completed_at: completed ? new Date().toISOString() : null
    }, { onConflict: 'enrollment_id, lesson_id' }) // Ensure your DB has this constraint/index
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Get detailed progress for a specific course
 * Returns list of completed lesson IDs and overall percentage
 */
const getCourseProgress = async (userId, courseId) => {
  // 1. Get enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (!enrollment) return { completedLessonIds: [], percent: 0 };

  // 2. Get all lessons count
  const { count: totalLessons } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', courseId);

  // 3. Get completed lessons for this enrollment
  const { data: progressEntries, count: completedCount } = await supabase
    .from('user_progress')
    .select('lesson_id', { count: 'exact' })
    .eq('enrollment_id', enrollment.id)
    .eq('completed', true);

  const percent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  const completedLessonIds = progressEntries.map(p => p.lesson_id);

  return {
    enrollmentId: enrollment.id,
    completedLessonIds,
    completedCount,
    totalLessons,
    percent
  };
};

module.exports = { updateProgress, getCourseProgress };