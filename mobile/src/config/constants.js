import { Platform } from 'react-native';

// Select correct URL based on device
const API_URL = Platform.select({
  // Android Emulator uses 10.0.2.2
  android: 'http://10.0.2.2:5000/api', 
  // iOS Simulator uses localhost
  ios: 'http://localhost:5000/api',
  // Fallback (e.g., physical device - REPLACE with your PC's IP)
  default: 'http://192.168.1.5:5000/api', 
});

export const CONFIG = {
  API_URL,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};