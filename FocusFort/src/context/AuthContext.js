import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Check login status on app start
  const isLoggedIn = async () => {
    try {
      let token = await AsyncStorage.getItem('userToken');
      let user = await AsyncStorage.getItem('userInfo');

      if (token) {
        setUserToken(token);
        setUserInfo(JSON.parse(user));
      }
    } catch (e) {
      console.log('Login check error', e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      
      setUserToken(data.token);
      setUserInfo(data.user);

      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
    } catch (error) {
      // Return error message to the screen
      throw error.response?.data?.message || 'Login failed';
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName, email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.signup(fullName, email, password);

      setUserToken(data.token);
      setUserInfo(data.user);

      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
    } catch (error) {
      throw error.response?.data?.message || 'Signup failed';
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ login, signup, logout, isLoading, userToken, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};