const supabase = require('../config/supabase');

// User submits application
const submitApplication = async (userId) => {
  // Check if already applied
  const { data: existing } = await supabase
    .from('creator_applications')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .single();

  if (existing) throw new Error('You already have a pending application');

  const { data, error } = await supabase
    .from('creator_applications')
    .insert([{ user_id: userId, status: 'pending' }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Admin: Get all pending applications
const getPendingApplications = async () => {
  const { data, error } = await supabase
    .from('creator_applications')
    .select('*, user:users(full_name, email, avatar_url)')
    .eq('status', 'pending');

  if (error) throw new Error(error.message);
  return data;
};

// Admin: Approve Application
const approveApplication = async (applicationId, adminId) => {
  // 1. Get application info
  const { data: app } = await supabase
    .from('creator_applications')
    .select('user_id')
    .eq('id', applicationId)
    .single();

  if (!app) throw new Error('Application not found');

  // 2. Update Application Status
  await supabase
    .from('creator_applications')
    .update({ status: 'approved', approved_by: adminId })
    .eq('id', applicationId);

  // 3. Upgrade User Role
  const { error } = await supabase
    .from('users')
    .update({ role: 'creator' }) // CHECK constraint allows 'creator'
    .eq('id', app.user_id);

  if (error) throw new Error(error.message);
  return { message: 'User upgraded to Creator' };
};

// Admin: Reject Application
const rejectApplication = async (applicationId, adminId) => {
  const { error } = await supabase
    .from('creator_applications')
    .update({ status: 'rejected', approved_by: adminId })
    .eq('id', applicationId);

  if (error) throw new Error(error.message);
  return { message: 'Application rejected' };
};

module.exports = { 
  submitApplication, 
  getPendingApplications, 
  approveApplication, 
  rejectApplication 
};