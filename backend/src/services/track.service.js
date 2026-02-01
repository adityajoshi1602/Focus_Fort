const supabase = require('../config/supabase');

const getAllTracks = async () => {
  const { data, error } = await supabase
    .from('tracks')
    .select('*, courses:track_courses(course:courses(id, title, thumbnail_url))');

  if (error) throw new Error(error.message);
  return data;
};

const getTrackById = async (trackId) => {
  const { data, error } = await supabase
    .from('tracks')
    .select('*, track_courses (order_number, course:courses (*))')
    .eq('id', trackId)
    .single();

  if (error) throw new Error('Track not found');
  if (data.track_courses) data.track_courses.sort((a, b) => a.order_number - b.order_number);
  
  return data;
};

const createTrack = async (trackData, userId) => {
  const { title, description, thumbnail_url } = trackData;
  const { data, error } = await supabase
    .from('tracks')
    .insert([{ title, description, thumbnail_url, creator_id: userId }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { getAllTracks, getTrackById, createTrack };