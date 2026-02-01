import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, FONTS } from '../../config/theme';
import CustomButton from '../../components/common/CustomButton';
import courseService from '../../services/course.service';
import enrollmentService from '../../services/enrollment.service';
import progressService from '../../services/progress.service';

const CourseDetailScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState({ completedLessonIds: [], percent: 0 });

  const fetchData = async () => {
    try {
      // 1. Get Course Details
      const courseData = await courseService.getCourseById(courseId);
      setCourse(courseData);

      // 2. Check Enrollment Status
      const statusData = await enrollmentService.checkStatus(courseId);
      setIsEnrolled(statusData.isEnrolled);

      // 3. If enrolled, get progress
      if (statusData.isEnrolled) {
        const progressData = await progressService.getCourseProgress(courseId);
        setProgress(progressData);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  // Reload data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [courseId])
  );

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollmentService.enroll(courseId);
      setIsEnrolled(true);
      Alert.alert('Success', 'You are now enrolled!');
      fetchData(); // Refresh to unlock lessons
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonPress = (lesson) => {
    if (!isEnrolled) {
      Alert.alert('Locked', 'Please enroll in the course to watch this lesson.');
      return;
    }
    navigation.navigate('LessonPlayer', { lesson, courseId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <Image source={{ uri: course?.thumbnail_url }} style={styles.thumbnail} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{course?.title}</Text>
        <Text style={styles.creator}>By {course?.creator?.full_name}</Text>
        
        {/* Progress Bar (if enrolled) */}
        {isEnrolled && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress.percent}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress.percent}% Complete</Text>
          </View>
        )}

        {/* Action Button */}
        <View style={styles.actionContainer}>
          {isEnrolled ? (
            <CustomButton 
              title="Continue Learning" 
              onPress={() => {
                // Find first uncompleted lesson logic could go here
                // For now, just scroll down
              }} 
            />
          ) : (
            <CustomButton 
              title="Enroll Now" 
              onPress={handleEnroll} 
              loading={enrolling} 
            />
          )}
        </View>

        <Text style={styles.description}>{course?.description}</Text>

        {/* Curriculum List */}
        <Text style={styles.sectionTitle}>Curriculum</Text>
        
        {course?.modules?.map((module) => (
          <View key={module.id} style={styles.moduleContainer}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            
            {module.lessons?.map((lesson, index) => {
              const isCompleted = progress.completedLessonIds.includes(lesson.id);
              
              return (
                <TouchableOpacity 
                  key={lesson.id} 
                  style={styles.lessonItem}
                  onPress={() => handleLessonPress(lesson)}
                >
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonIndex}>{index + 1}</Text>
                    <View>
                      <Text style={[styles.lessonTitle, !isEnrolled && styles.lockedText]}>
                        {lesson.title}
                      </Text>
                      <Text style={styles.lessonDuration}>{lesson.duration} min</Text>
                    </View>
                  </View>
                  
                  <Ionicons 
                    name={isCompleted ? "checkmark-circle" : (isEnrolled ? "play-circle" : "lock-closed")} 
                    size={24} 
                    color={isCompleted ? COLORS.secondary : (isEnrolled ? COLORS.primary : COLORS.textSub)} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  thumbnail: { width: '100%', height: 200, resizeMode: 'cover' },
  content: { padding: SPACING.md },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  creator: { fontSize: 14, color: COLORS.textSub, marginBottom: SPACING.md },
  description: { fontSize: 14, color: COLORS.textSub, lineHeight: 20, marginBottom: SPACING.lg },
  actionContainer: { marginBottom: SPACING.lg },
  progressContainer: { marginBottom: SPACING.lg },
  progressBarBg: { height: 6, backgroundColor: COLORS.surface, borderRadius: 3, marginBottom: 4 },
  progressBarFill: { height: 6, backgroundColor: COLORS.secondary, borderRadius: 3 },
  progressText: { color: COLORS.secondary, fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  moduleContainer: { marginBottom: SPACING.lg },
  moduleTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textSub, marginBottom: SPACING.sm, backgroundColor: COLORS.surface, padding: SPACING.sm, borderRadius: 4 },
  lessonItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  lessonInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  lessonIndex: { color: COLORS.textSub, marginRight: SPACING.md, fontWeight: 'bold' },
  lessonTitle: { color: COLORS.text, fontSize: 15, fontWeight: '500' },
  lockedText: { color: COLORS.textSub },
  lessonDuration: { color: COLORS.textSub, fontSize: 12, marginTop: 2 },
});

export default CourseDetailScreen;