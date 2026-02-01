const supabase = require('../config/supabase');

const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { getAllCategories };