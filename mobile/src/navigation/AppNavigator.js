import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../config/theme';
import CreatorDashboardScreen from '../screens/main/CreatorDashboardScreen';
import MyCoursesScreen from '../screens/main/MyCoursesScreen';
import CourseDetailsScreen from '../screens/main/CourseDetailsScreen';

import AuthStack from './AuthStack';
import MainTab from './MainTab';

// Import Content Screens
import CourseDetailScreen from '../screens/content/CourseDetailScreen';
import LessonPlayerScreen from '../screens/content/LessonPlayerScreen';

// Import Admin/Main Screens
import AdminDashboardScreen from '../screens/main/AdminDashboardScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen'; // <--- ADDED IMPORT

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { isLoading, userToken } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {userToken ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>

                    {/* 1. Main App (Tabs) */}
                    <Stack.Screen name="Main" component={MainTab} />

                    {/* 2. Content Screens */}
                    <Stack.Screen
                        name="CourseDetail"
                        component={CourseDetailScreen}
                        options={{
                            headerShown: true,
                            headerTintColor: COLORS.text,
                            headerStyle: { backgroundColor: COLORS.background },
                            title: ''
                        }}
                    />

                    <Stack.Screen
                        name="LessonPlayer"
                        component={LessonPlayerScreen}
                        options={{
                            headerShown: true,
                            headerTintColor: COLORS.text,
                            headerStyle: { backgroundColor: COLORS.background },
                            title: ''
                        }}
                    />

                    {/* 3. Admin & Profile Screens */}
                    <Stack.Screen
                        name="AdminDashboard"
                        component={AdminDashboardScreen}
                        options={{
                            headerShown: true,
                            title: 'Admin Dashboard',
                            headerStyle: { backgroundColor: COLORS.background },
                            headerTintColor: COLORS.text
                        }}
                    />

                    {/* 4. Edit Profile Screen (THIS WAS MISSING) */}
                    <Stack.Screen
                        name="EditProfile"
                        component={EditProfileScreen}
                        options={{
                            headerShown: true,
                            title: 'Edit Profile',
                            headerStyle: { backgroundColor: COLORS.background },
                            headerTintColor: COLORS.text
                        }}
                    />

                    <Stack.Screen
                        name="CreatorDashboard"
                        component={CreatorDashboardScreen}
                        options={{
                            headerShown: true,
                            title: 'Creator Studio',
                            headerStyle: { backgroundColor: COLORS.background },
                            headerTintColor: COLORS.text
                        }}
                    />
                    <Stack.Screen
                        name="CourseDetails"
                        component={CourseDetailsScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;