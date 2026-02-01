import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// ✅ FIX: Use the standard library instead of @expo
import Ionicons from 'react-native-vector-icons/Ionicons'; 

import HomeScreen from '../screens/main/HomeScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import LearnScreen from '../screens/main/LearnScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
// 👇 1. IMPORT THE NEW SCREEN
import MyCoursesScreen from '../screens/main/MyCoursesScreen'; 

import { COLORS } from '../config/theme';

const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSub,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Learn') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'MyCourses') {
            // 👇 2. ICON FOR NEW TAB
            iconName = focused ? 'book' : 'book-outline'; 
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      
      {/* 👇 3. ADD THE NEW TAB HERE */}
      <Tab.Screen 
        name="MyCourses" 
        component={MyCoursesScreen} 
        options={{ tabBarLabel: 'My Learning' }}
      />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTab;