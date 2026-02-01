# FocusFort

**FocusFort** is a mobile-first learning platform that merges short-form educational discovery with structured, long-form courses.  
It combines the engagement mechanics of social video platforms with the depth and discipline of serious learning systems.

> **Discovery brings attention. Structure builds mastery.**

---

## ✨ Core Features

### Learners
- Watch short educational videos (infinite vertical feed)
- Discover courses directly from shorts
- Enroll in structured courses
- Watch lessons and track progress
- Like and comment on content
- Join learning communities
- Earn achievements and learning streaks

### Creators
- Upload short educational videos
- Create structured courses with modules and lessons
- Upload lesson videos and thumbnails
- Manage and edit owned content
- View performance analytics (views, likes, enrollments)

### Admin (Planned)
- Approve creator applications
- Moderate content
- Manage categories and learning tracks

---

## 🧠 Product Philosophy

- Short-form content solves discovery
- Structured learning solves retention
- Progress tracking solves motivation

FocusFort is designed to keep users engaged **without sacrificing depth or rigor**.

---

## 🏗️ Tech Stack

### Frontend (Mobile)
- React Native (Expo)
- React Navigation v6
- Axios
- react-native-video
- AsyncStorage
- Custom UI components

### Backend
- Node.js + Express
- Supabase (PostgreSQL + Storage)
- JWT Authentication
- bcryptjs
- Multer
- express-validator

---

## 📁 Project Structure

### Backend
focusfort-backend/
├── src/
│ ├── config/
│ ├── controllers/
│ ├── services/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ └── server.js
├── .env
├── package.json
└── README.md


### Frontend
focusfort-app/
├── src/
│ ├── screens/
│ ├── components/
│ ├── navigation/
│ ├── services/
│ ├── hooks/
│ ├── context/
│ └── utils/
├── app.json
├── package.json
└── README.md


---

## 🔐 Authentication & Security

- JWT-based authentication
- Password hashing using bcrypt (10+ rounds)
- Role-based access control (user / creator / admin)
- Supabase Row Level Security (RLS)
- Ownership checks on protected resources
- File upload validation (size & MIME type)

---

###🗺️ Roadmap

Advanced search and filters

Offline lesson support

Quizzes and assignments

Certificates

Creator monetization

Push notifications

Recommendation engine


###🚧 Active Development
Built with scalability and production readiness in mind.

###📄 License
MIT License