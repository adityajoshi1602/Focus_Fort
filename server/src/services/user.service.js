const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

/**
 * Get public user profile
 */
const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, bio, avatar_url, role, created_at')
    .eq('id', userId)
    .single();

  if (error) throw new Error('User not found');
  return data;
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updateData) => {
  const { full_name, bio, avatar_url } = updateData;
  
  const { data, error } = await supabase
    .from('users')
    .update({ full_name, bio, avatar_url })
    .eq('id', userId)
    .select('id, full_name, bio, avatar_url, role')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Get courses created by specific user (Creator Profile)
 */
const getUserCreatedCourses = async (userId) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('creator_id', userId)
    .eq('status', 'published');

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { getUserById, updateUserProfile, getUserCreatedCourses };