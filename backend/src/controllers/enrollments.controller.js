const supabase = require('../config/supabase');

// 1. Get My Courses
const getMyEnrollments = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, course:courses(*, creator:users(full_name))')
      .eq('user_id', userId);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Enroll in a Course
const enrollCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    // Create Enrollment
    const { data, error } = await supabase
      .from('enrollments')
      .insert([{ user_id: userId, course_id: courseId, progress_percentage: 0 }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ CRITICAL: Make sure both functions are exported here!
module.exports = { 
  getMyEnrollments, 
  enrollCourse 
};