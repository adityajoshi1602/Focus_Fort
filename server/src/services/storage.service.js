const supabase = require('../config/supabase');

/**
 * Upload file to Supabase Storage
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The folder path (e.g., 'userId')
 * @param {object} file - The file object from multer
 */
const uploadFile = async (bucket, path, file) => {
  const fileExt = file.originalname.split('.').pop();
  // Create unique filename: timestamp-random.ext
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw new Error(error.message);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};

/**
 * Delete file from storage
 */
const deleteFile = async (bucket, path) => {
  // Extract path relative to bucket from full URL if needed, 
  // but usually we store just the path or handle logic in frontend.
  // For simplicity, we assume 'path' is the internal storage path.
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw new Error(error.message);
  return true;
};

module.exports = { uploadFile, deleteFile };