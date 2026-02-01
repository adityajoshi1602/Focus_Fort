const supabase = require('../config/supabase');

/**
 * Create a Short
 */
const createShort = async (shortData, userId) => {
  const { title, description, video_url, thumbnail_url, course_id, tags } = shortData;

  const { data, error } = await supabase
    .from('shorts')
    .insert([{
      creator_id: userId,
      title,
      description,
      video_url,
      thumbnail_url,
      course_id: course_id || null, // Optional link to deep learning
      tags: tags || []
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Get Shorts Feed (Pagination + Randomization/Algorithm logic placeholder)
 */
const getShortsFeed = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  // Fetch shorts with creator info
  const { data, error, count } = await supabase
    .from('shorts')
    .select(`
      *,
      creator:users(id, full_name, avatar_url),
      course:courses(id, title)
    `, { count: 'exact' })
    .order('created_at', { ascending: false }) // TODO: Replace with algo later
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  return {
    shorts: data,
    hasMore: offset + limit < count,
    total: count
  };
};

/**
 * Get Single Short
 */
const getShortById = async (shortId) => {
  const { data, error } = await supabase
    .from('shorts')
    .select(`
      *,
      creator:users(id, full_name, avatar_url),
      course:courses(id, title)
    `)
    .eq('id', shortId)
    .single();

  if (error) throw new Error('Short not found');
  return data;
};

/**
 * Delete Short
 */
const deleteShort = async (shortId, userId) => {
  // Check ownership
  const { data: short } = await supabase
    .from('shorts')
    .select('creator_id')
    .eq('id', shortId)
    .single();

  if (!short) throw new Error('Short not found');
  if (short.creator_id !== userId) throw new Error('Unauthorized');

  const { error } = await supabase.from('shorts').delete().eq('id', shortId);
  if (error) throw new Error(error.message);
  return { message: 'Short deleted' };
};

module.exports = { createShort, getShortsFeed, getShortById, deleteShort };