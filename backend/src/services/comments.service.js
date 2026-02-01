const supabase = require('../config/supabase');

/**
 * Add a comment
 */
const addComment = async (userId, type, id, content) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      commentable_type: type,
      commentable_id: id,
      content
    })
    .select(`
      *,
      user:users(id, full_name, avatar_url)
    `)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Get comments for an item
 */
const getComments = async (type, id) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      user:users(id, full_name, avatar_url)
    `)
    .eq('commentable_type', type)
    .eq('commentable_id', id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Delete a comment (User owns comment)
 */
const deleteComment = async (userId, commentId) => {
  // Check ownership
  const { data: comment } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single();

  if (!comment) throw new Error('Comment not found');
  if (comment.user_id !== userId) throw new Error('Unauthorized');

  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  
  if (error) throw new Error(error.message);
  return { message: 'Comment deleted' };
};

module.exports = { addComment, getComments, deleteComment };