const supabase = require('../config/supabase');
const creatorService = require('../services/creator.service'); // We might not need this service file if we write logic here directly

// 1. APPLY FUNCTION
const apply = async (req, res) => {
  console.log("👉 Creator Application Request Received");
  console.log("👤 User ID:", req.user?.id);

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Check if already applied
    const { data: existing } = await supabase
      .from('creator_applications')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing) {
      console.log("⚠️ Application already exists:", existing);
      return res.status(400).json({ message: 'You have already applied.' });
    }

    // Insert new application
    const { data, error } = await supabase
      .from('creator_applications')
      .insert([
        { 
          user_id: userId, 
          status: 'pending',
          submitted_at: new Date()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase Insert Error:", error);
      throw error;
    }

    console.log("✅ Application Successful:", data);
    res.status(201).json({ message: 'Application submitted successfully', data });

  } catch (error) {
    console.error("❌ Controller Error:", error.message);
    res.status(400).json({ message: error.message || 'Failed to apply' });
  }
};

// 2. GET APPLICATIONS (Admin)
const getApplications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('creator_applications')
      .select('*, user:users(full_name, email)') // Fetch user details too
      .eq('status', 'pending');

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. REVIEW APPLICATION (Admin)
const reviewApplication = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' or 'reject'
  const adminId = req.user.id;

  try {
    // Update Application Status
    const { error: appError } = await supabase
      .from('creator_applications')
      .update({ status: action === 'approve' ? 'approved' : 'rejected', approved_by: adminId })
      .eq('id', id);

    if (appError) throw appError;

    // If approved, update User Role
    if (action === 'approve') {
       // Get user_id from the application first
       const { data: appData } = await supabase.from('creator_applications').select('user_id').eq('id', id).single();
       
       if (appData) {
         await supabase
           .from('users')
           .update({ role: 'creator' })
           .eq('id', appData.user_id);
       }
    }

    res.status(200).json({ message: `Application ${action}d` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { apply, getApplications, reviewApplication };