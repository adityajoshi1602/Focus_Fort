const supabase = require('../config/supabase');

const getAllCommunities = async () => {
  const { data, error } = await supabase
    .from('communities')
    .select('*, members:community_members(count)');
  if (error) throw new Error(error.message);
  return data;
};

const joinCommunity = async (userId, communityId) => {
  const { data, error } = await supabase
    .from('community_members')
    .insert({ user_id: userId, community_id: communityId })
    .select()
    .single();
  
  if (error && error.code !== '23505') throw new Error(error.message);
  return data;
};

module.exports = { getAllCommunities, joinCommunity };