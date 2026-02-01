import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/theme';
import api from '../../services/api'; 

const CourseDetailsScreen = ({ route, navigation }) => {
  const { course } = route.params;
  const [loading, setLoading] = useState(false);

  // ✅ Enroll Function
  const handleEnroll = async () => {
    setLoading(true);
    try {
      // 1. Send Request to Backend
      await api.post('/enrollments', { courseId: course.id });

      // 2. Success Alert
      Alert.alert(
        "Success! 🎉",
        "You have enrolled in this course.",
        [
          { 
            text: "Go to My Learning", 
            // ⚠️ FIX: We tell it to go to 'MainTab', then to the specific screen 'MyCourses'
            onPress: () => navigation.navigate('MyCourses') 
          },
          { text: "Stay Here", style: "cancel" }
        ]
      );
    } catch (error) {
      // 3. Handle "Already Enrolled"
      if (error.response && error.response.status === 400) {
        Alert.alert("Info", "You are already enrolled in this course!", [
            { 
              text: "Go to My Learning", 
              onPress: () => navigation.navigate('MyCourses') 
            }
        ]);
      } else {
        console.error(error);
        Alert.alert("Error", "Failed to enroll. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: course.thumbnail_url || 'https://via.placeholder.com/300' }} 
            style={styles.image} 
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.badges}>
            <Text style={styles.categoryBadge}>{course.category || 'General'}</Text>
            <Text style={styles.levelBadge}>{course.difficulty_level || 'Beginner'}</Text>
          </View>

          <Text style={styles.title}>{course.title}</Text>
          
          <View style={styles.metaRow}>
            <Ionicons name="person-circle-outline" size={20} color={COLORS.textSub} />
            <Text style={styles.instructor}>Created by {course.creator?.full_name || 'Instructor'}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About this Course</Text>
          <Text style={styles.description}>
            {course.description || 'No description available for this course.'}
          </Text>

          <View style={styles.divider} />

          {/* Dummy Lessons List */}
          <Text style={styles.sectionTitle}>Course Content</Text>
          {['Introduction', 'Getting Started', 'Core Concepts', 'Final Project'].map((lesson, index) => (
            <View key={index} style={styles.lessonItem}>
              <View style={styles.lessonIcon}>
                <Ionicons name="play-circle" size={24} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.lessonTitle}>{index + 1}. {lesson}</Text>
                <Text style={styles.lessonDuration}>10:00 mins</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.enrollBtn} 
          onPress={handleEnroll}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.enrollText}>Start Learning</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 100 },
  
  imageContainer: { height: 250, width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  backBtn: { 
    position: 'absolute', top: 50, left: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 
  },

  content: { padding: 20, marginTop: -20, backgroundColor: COLORS.background, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  
  badges: { flexDirection: 'row', marginBottom: 15 },
  categoryBadge: { color: COLORS.primary, fontWeight: 'bold', marginRight: 15, textTransform: 'uppercase', fontSize: 12 },
  levelBadge: { color: COLORS.textSub, textTransform: 'uppercase', fontSize: 12 },

  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  instructor: { color: COLORS.textSub, marginLeft: 8 },

  divider: { height: 1, backgroundColor: '#333', marginVertical: 20 },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  description: { color: COLORS.textSub, lineHeight: 22 },

  lessonItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: COLORS.surface || '#1E1E1E', padding: 12, borderRadius: 10 },
  lessonIcon: { marginRight: 15 },
  lessonTitle: { color: COLORS.text, fontWeight: 'bold', fontSize: 14 },
  lessonDuration: { color: COLORS.textSub, fontSize: 12 },

  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: 20, backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: '#333' 
  },
  enrollBtn: { 
    backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center' 
  },
  enrollText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default CourseDetailsScreen;