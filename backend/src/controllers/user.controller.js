const supabase = require('../config/supabase');

const updateProfile = async (req, res) => {
  console.log("👉 1. Request reached updateProfile!"); // Debug Log 1
  console.log("📦 Body received:", req.body);           // Debug Log 2
  console.log("👤 User ID from token:", req.user?.id);  // Debug Log 3

  const { bio, username } = req.body;
  const userId = req.user.id;

  try {
    console.log("Attempting Supabase update..."); // Debug Log 4
    
    const { data, error } = await supabase
      .from('users')
      .update({ bio, username })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase Error:", error); // Critical Error Log
      throw error;
    }

    console.log("✅ Update Success:", data); // Success Log
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Controller Catch Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { updateProfile };