const supabase = require('../config/supabase');

const ALLOWED_TYPES = ['short', 'course', 'lesson'];

/**
 * Toggle Like (Like if not liked, Unlike if already liked)
 */
const toggleLike = async (userId, type, id) => {
  if (!ALLOWED_TYPES.includes(type)) throw new Error('Invalid content type');

  // 1. Check if like exists
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('likeable_type', type)
    .eq('likeable_id', id)
    .single();

  if (existing) {
    // 2. DELETE (Unlike)
    await supabase.from('likes').delete().eq('id', existing.id);
    return { liked: false };
  } else {
    // 3. INSERT (Like)
    await supabase
      .from('likes')
      .insert({
        user_id: userId,
        likeable_type: type,
        likeable_id: id
      });
    return { liked: true };
  }
};

/**
 * Get Like Count for an item
 */
const getLikeCount = async (type, id) => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('likeable_type', type)
    .eq('likeable_id', id);

  if (error) throw new Error(error.message);
  return count;
};

/**
 * Check if user liked an item
 */
const checkUserLiked = async (userId, type, id) => {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('likeable_type', type)
    .eq('likeable_id', id)
    .single();

  return !!data;
};

module.exports = { toggleLike, getLikeCount, checkUserLiked };