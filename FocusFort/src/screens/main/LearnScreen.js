import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  TextInput 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/theme'; 
import api from '../../services/api';

const LearnScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Courses from Backend
  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
      setFilteredCourses(response.data); // Initialize filtered list
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [])
  );

  // 2. Handle Search
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(text.toLowerCase()) ||
        course.category.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  };

  // 3. Render Each Course Card
  const renderCourse = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('CourseDetails', { course: item })}
    >
      {/* Course Thumbnail */}
      <Image 
        source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/300' }} 
        style={styles.thumbnail} 
      />
      
      {/* Course Info */}
      <View style={styles.cardContent}>
        <View style={styles.badgeContainer}>
          <Text style={styles.categoryBadge}>{item.category || 'General'}</Text>
          <Text style={styles.levelBadge}>{item.difficulty_level || 'Beginner'}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.creator}>By {item.creator?.full_name || 'Instructor'}</Text>
        
        <View style={styles.footer}>
          {/* Price removed as requested */}
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
          
          <Ionicons name="arrow-forward-circle-outline" size={24} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Courses</Text>
        <Text style={styles.headerSubtitle}>Find the perfect course for you</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput 
          placeholder="Search courses..." 
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchCourses} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="library-outline" size={64} color="#555" />
            <Text style={styles.emptyText}>No courses found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  headerSubtitle: { fontSize: 14, color: COLORS.textSub, marginTop: 5 },

  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.surface || '#1E1E1E', 
    marginHorizontal: 20, 
    borderRadius: 12, 
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 16 },

  list: { paddingHorizontal: 20, paddingBottom: 100 },
  
  // Card Styles
  card: { 
    backgroundColor: COLORS.surface || '#1E1E1E', 
    borderRadius: 16, 
    marginBottom: 20, 
    overflow: 'hidden',
    elevation: 3 
  },
  thumbnail: { width: '100%', height: 160, backgroundColor: '#333' },
  cardContent: { padding: 15 },
  
  badgeContainer: { flexDirection: 'row', marginBottom: 8 },
  categoryBadge: { 
    backgroundColor: 'rgba(108, 99, 255, 0.2)', 
    color: COLORS.primary, 
    fontSize: 10, 
    fontWeight: 'bold', 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 6,
    marginRight: 8,
    textTransform: 'uppercase'
  },
  levelBadge: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    color: COLORS.textSub, 
    fontSize: 10, 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 6,
    textTransform: 'uppercase'
  },

  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 },
  creator: { fontSize: 14, color: COLORS.textSub, marginBottom: 12 },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: COLORS.text, marginLeft: 4, fontSize: 12, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: COLORS.textSub, marginTop: 10, fontSize: 16 }
});

export default LearnScreen;