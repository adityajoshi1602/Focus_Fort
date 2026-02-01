import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../config/theme'; // Adjust path if needed (e.g. ../../../config/theme)
import api from '../../services/api';

const MyCoursesScreen = ({ navigation }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enrollments');
      console.log("📚 My Courses Data:", response.data); 
      setEnrollments(response.data);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEnrollments();
    }, [])
  );

  const renderItem = ({ item }) => {
    // Determine the course object based on how backend sends it
    // Sometimes it's item.course, sometimes the item IS the course if structure varies
    const course = item.course || {}; 
    
    return (
      <TouchableOpacity style={styles.card}>
        <Image 
          source={{ uri: course.thumbnail_url || 'https://via.placeholder.com/150' }} 
          style={styles.thumbnail} 
        />
        <View style={styles.info}>
          <Text style={styles.category}>{course.category || 'General'}</Text>
          <Text style={styles.title} numberOfLines={2}>{course.title || 'Untitled Course'}</Text>
          <Text style={styles.author}>By {course.creator?.full_name || 'Unknown'}</Text>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${item.progress_percentage || 0}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progress_percentage || 0}% Complete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Learning</Text>

      {enrollments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You haven't enrolled in any courses yet.</Text>
        </View>
      ) : (
        <FlatList
          data={enrollments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchEnrollments} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, paddingHorizontal: 20, marginBottom: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface || '#1E1E1E', borderRadius: 12, marginBottom: 15, padding: 10, elevation: 2 },
  thumbnail: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#333' },
  info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  category: { fontSize: 10, color: COLORS.primary, fontWeight: 'bold', textTransform: 'uppercase' },
  title: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  author: { fontSize: 12, color: COLORS.textSub || '#888', marginBottom: 8 },
  progressContainer: { height: 4, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: COLORS.primary },
  progressText: { fontSize: 10, color: '#888', marginTop: 4, textAlign: 'right' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: '#888', fontSize: 16 }
});

export default MyCoursesScreen;