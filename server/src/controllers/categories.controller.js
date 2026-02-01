const supabase = require('../config/supabase');

const getAllCategories = async (req, res) => {
  try {
    // We will hardcode these for now since we don't have a 'categories' table yet,
    // or fetch unique categories from the courses table if you prefer.
    // For MVP, returning a static list is fastest and safest.
    
    const categories = [
      { id: '1', name: 'All', icon: 'apps' },
      { id: '2', name: 'Development', icon: 'code-slash' },
      { id: '3', name: 'Design', icon: 'brush' },
      { id: '4', name: 'Business', icon: 'briefcase' },
      { id: '5', name: 'Lifestyle', icon: 'happy' },
      { id: '6', name: 'Music', icon: 'musical-notes' },
    ];

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCategories };