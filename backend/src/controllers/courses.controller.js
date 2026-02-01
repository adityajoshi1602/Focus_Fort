const supabase = require('../config/supabase');

// 1. Get All Published Courses (For Learn Page)
const getAllCourses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, creator:users(full_name)')
      .eq('is_published', true) // Only show published courses
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Single Course Details (With Modules & Lessons)
const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch Course Info
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*, creator:users(full_name, bio, avatar_url)')
      .eq('id', id)
      .single();

    if (courseError) throw courseError;

    // Fetch Modules & Lessons
    const { data: modules, error: moduleError } = await supabase
      .from('course_modules')
      .select('*, lessons(*)')
      .eq('course_id', id)
      .order('order_index', { ascending: true });

    if (moduleError) throw moduleError;

    res.status(200).json({ ...course, modules });
  } catch (error) {
    res.status(404).json({ message: 'Course not found' });
  }
};

module.exports = { getAllCourses, getCourseById };