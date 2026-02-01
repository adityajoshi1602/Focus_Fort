import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING } from '../../config/theme';

const CourseCard = ({ enrollment, onPress }) => {
  const { course, progress_percentage } = enrollment;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: course.thumbnail_url }} style={styles.thumbnail} />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.creator}>By {course.creator?.full_name}</Text>
        
        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progress_percentage || 0}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{progress_percentage || 0}% Complete</Text>
          </View>
          
          <Ionicons name="play-circle" size={32} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    height: 110,
  },
  thumbnail: {
    width: 110,
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  creator: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  progressContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: COLORS.textSub,
  },
});

export default CourseCard;