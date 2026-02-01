🎓 FocusFort - Mobile Learning App
FocusFort is a React Native mobile application designed for online learning. It allows users to browse courses, enroll, watch lessons, and track their progress. The app includes a dedicated instructor/creator mode and secure authentication.

🚀 Features
Authentication: Secure Login & Signup (JWT based).

Course Discovery: Explore and search for new courses.

My Learning: Track enrolled courses and progress.

Video Player: Watch course content on the go.

Creator Mode: Apply to become an instructor and manage content.

Cross-Platform: Built with React Native (Android & iOS).

🛠 Tech Stack
Frontend: React Native (Bare Workflow), React Navigation v6, Axios, AsyncStorage.

Backend: Node.js, Express.js.

Styling: Custom StyleSheet with a centralized Theme config.

Icons: react-native-vector-icons.

⚙️ Prerequisites
Before running the project, ensure you have the following installed:

Node.js (v14 or higher)

JDK 11 or 17 (Java Development Kit)

Android Studio (with Android SDK and a Virtual Device/Emulator installed)

Metrobundler (Installed automatically via npm)

📥 Installation
1. Clone/Open the Project
Navigate to your project folder:

Bash
cd C:\FocusFort_Orignal\FocusFort
2. Install Frontend Dependencies
Install the required packages for navigation, icons, and networking:

Bash
npm install
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-vector-icons axios @react-native-async-storage/async-storage
3. Setup Backend (Server)
Open a new terminal, navigate to your backend folder, and install dependencies:

Bash
cd backend
npm install
(Make sure your database is running if required).

🏃‍♂️ How to Run the App
Step 1: Start the Backend
In the Backend Terminal, run:

Bash
npm run dev
# OR
node server.js
Ensure the server is running on Port 5000.

Step 2: Configure the API URL
This is crucial to prevent "Network Errors" or "White Screens".

Open src/config/constants.js and set the API_URL:

For Android Emulator (Laptop):

JavaScript
export const CONFIG = {
  API_URL: 'http://10.0.2.2:5000/api', // Special IP for Emulator
  HEADERS: { 'Content-Type': 'application/json' },
};
For Physical Phone (via USB/Wi-Fi):

JavaScript
export const CONFIG = {
  API_URL: 'http://192.168.1.5:5000/api', // Replace with your PC's IPv4 Address
  HEADERS: { 'Content-Type': 'application/json' },
};
Step 3: Start the Frontend
In the Frontend Terminal, start the Metro Bundler with a cache reset (prevents common errors):

Bash
npm start -- --reset-cache
Step 4: Launch on Android
Open a second Frontend Terminal and run:

Bash
npx react-native run-android
🐛 Troubleshooting Common Errors
1. "Render Error: Couldn't register the navigator"
Fix: Ensure App.js wraps everything in <NavigationContainer>. Check that you have installed react-native-screens and react-native-safe-area-context.

2. White Screen on Startup
Fix:

Check src/config/constants.js to ensure the API URL matches your device (Emulator vs Phone).

Ensure LoginScreen.js is correctly exported and not empty.

Reset the cache: npm start -- --reset-cache.

3. "Network Request Failed" (Physical Phone)
Fix:

Ensure your phone and laptop are on the SAME Wi-Fi.

Turn OFF Mobile Data.

Allow Node.js through your Windows Firewall (Private & Public).

Update API_URL to your computer's IP (check via ipconfig).

4. "Unable to resolve module @expo/vector-icons"
Fix: This is a bare React Native app. Do not use Expo packages. In your files, change imports from: import { Ionicons } from '@expo/vector-icons'; To: import Ionicons from 'react-native-vector-icons/Ionicons';

📂 Project Structure
FocusFort/
├── android/             # Android Native Code
├── ios/                 # iOS Native Code
├── src/
│   ├── components/      # Reusable UI (Buttons, Inputs)
│   ├── config/          # Constants, Theme, API URLs
│   ├── context/         # Global State (AuthContext)
│   ├── navigation/      # AppNavigator, AuthNavigator, MainTab
│   ├── screens/         # All App Screens
│   │   ├── auth/        # Login, Signup
│   │   └── main/        # Home, CourseDetails, Profile
│   └── services/        # API calls (axios)
├── App.js               # Main Entry Point
└── package.json         # Dependencies
