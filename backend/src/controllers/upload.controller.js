const storageService = require('../services/storage.service');

// Map endpoints to buckets
const BUCKETS = {
  avatar: 'user-avatars',
  shortVideo: 'shorts-videos',
  shortThumbnail: 'shorts-thumbnails',
  courseVideo: 'course-videos',
  courseThumbnail: 'course-thumbnails',
};

const uploadFile = (type) => async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const bucketName = BUCKETS[type];
    const userId = req.user.id;

    // Upload to Supabase: bucket / userId / filename
    const publicUrl = await storageService.uploadFile(bucketName, userId, req.file);

    res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

module.exports = {
  uploadAvatar: uploadFile('avatar'),
  uploadShortVideo: uploadFile('shortVideo'),
  uploadShortThumbnail: uploadFile('shortThumbnail'),
  uploadCourseVideo: uploadFile('courseVideo'),
  uploadCourseThumbnail: uploadFile('courseThumbnail'),
};