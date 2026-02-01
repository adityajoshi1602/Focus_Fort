const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load dotenv
dotenv.config();

// Connect to database
require('./config/supabase');

// --- 1. IMPORT ROUTES ---
// ✅ Active Routes (These files exist)
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const creatorRoutes = require('./routes/creator.routes');
const shortsRoutes = require('./routes/shorts.routes');
const courseRoutes = require('./routes/courses.routes');
const enrollmentRoutes = require('./routes/enrollments.routes');
const categoriesRoutes = require('./routes/categories.routes'); // 👈 ADDED THIS

// ⚠️ Future Routes (Keep commented until you build them)
// const lessonRoutes = require('./routes/lessons.routes');
// const uploadRoutes = require('./routes/upload.routes');
// const progressRoutes = require('./routes/progress.routes');
// const likesRoutes = require('./routes/likes.routes');
// const commentsRoutes = require('./routes/comments.routes');
// const communityRoutes = require('./routes/communities.routes');

const app = express();

// --- 2. MIDDLEWARE ---
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- 3. MOUNT ROUTES ---
// ✅ Active Endpoints
app.use('/api/auth', authRoutes);           // Signup, Login
app.use('/api/users', userRoutes);          // Profile, Edit Profile
app.use('/api/creator', creatorRoutes);     // Apply, Admin Dashboard
app.use('/api/shorts', shortsRoutes);       // Home Feed, Upload Short
app.use('/api/courses', courseRoutes);      // Learn Page (All Courses)
app.use('/api/enrollments', enrollmentRoutes); // My Courses
app.use('/api/categories', categoriesRoutes); // 👈 Explore Page Categories

// ⚠️ Future Endpoints
// app.use('/api/lessons', lessonRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/likes', likesRoutes);
// app.use('/api/comments', commentsRoutes);
// app.use('/api/communities', communityRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('LearnFlow API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});