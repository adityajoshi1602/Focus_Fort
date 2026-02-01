const supabase = require('../config/supabase');

const createShort = async (req, res) => {
  console.log("🎬 Upload Short Request Received!"); 
  
  const { title, video_url, thumbnail_url, description } = req.body; // <--- Added description
  const userId = req.user?.id;

  // Basic Validation
  if (!title || !video_url) {
    return res.status(400).json({ message: 'Title and Video URL are required' });
  }

  try {
    const { data, error } = await supabase
      .from('shorts')
      .insert([
        {
          creator_id: userId,
          title,
          video_url,
          description: description || 'No description', // <--- Default text if empty
          thumbnail_url: thumbnail_url || null,
          likes_count: 0,
          views_count: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase INSERT Error:", error); 
      throw error;
    }

    console.log("✅ Success:", data);
    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Controller Catch Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const getAllShorts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shorts')
      .select('*, creator:users(full_name, id)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createShort, getAllShorts };