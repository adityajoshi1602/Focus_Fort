const supabase = require('../config/supabase');

/**
 * Create a new course
 */
const createCourse = async (courseData, userId) => {
  const { title, description, category_id, thumbnail_url, difficulty, estimated_duration } = courseData;

  const { data, error } = await supabase
    .from('courses')
    .insert([{
      title,
      description,
      creator_id: userId,
      category_id,
      thumbnail_url,
      difficulty,         // e.g., 'Beginner', 'Intermediate', 'Advanced'
      estimated_duration, // e.g., '2h 30m'
      status: 'draft'     // Default to draft
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Get all courses with pagination and filters
 */
const getAllCourses = async (query) => {
  const { page = 1, limit = 10, search, category_id } = query;
  const offset = (page - 1) * limit;

  let api = supabase
    .from('courses')
    .select('*, creator:users(full_name, avatar_url), category:categories(name)', { count: 'exact' })
    .eq('status', 'published'); // Only show published courses publically

  // Apply filters
  if (search) api = api.ilike('title', `%${search}%`);
  if (category_id) api = api.eq('category_id', category_id);

  // Pagination
  const { data, error, count } = await api
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return { courses: data, total: count, page: parseInt(page), pages: Math.ceil(count / limit) };
};

/**
 * Get single course with full curriculum (Modules -> Lessons)
 */
const getCourseById = async (courseId) => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      creator:users(id, full_name, avatar_url, bio),
      category:categories(id, name),
      modules:course_modules(
        id, title, order_number,
        lessons(id, title, duration, order_number, type, is_free)
      )
    `)
    .eq('id', courseId)
    .single();

  if (error) throw new Error('Course not found');
  
  // Sort modules and lessons by order_number
  if (data.modules) {
    data.modules.sort((a, b) => a.order_number - b.order_number);
    data.modules.forEach(mod => {
      if (mod.lessons) mod.lessons.sort((a, b) => a.order_number - b.order_number);
    });
  }

  return data;
};

/**
 * Update course (Check ownership)
 */
const updateCourse = async (courseId, userId, updateData) => {
  // 1. Check ownership
  const { data: course } = await supabase
    .from('courses')
    .select('creator_id')
    .eq('id', courseId)
    .single();

  if (!course) throw new Error('Course not found');
  if (course.creator_id !== userId) throw new Error('Not authorized to update this course');

  // 2. Update
  const { data, error } = await supabase
    .from('courses')
    .update(updateData)
    .eq('id', courseId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Delete course (Check ownership)
 */
const deleteCourse = async (courseId, userId) => {
  // 1. Check ownership
  const { data: course } = await supabase
    .from('courses')
    .select('creator_id')
    .eq('id', courseId)
    .single();

  if (!course) throw new Error('Course not found');
  if (course.creator_id !== userId) throw new Error('Not authorized to delete this course');

  // 2. Delete
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);

  if (error) throw new Error(error.message);
  return { message: 'Course deleted successfully' };
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};