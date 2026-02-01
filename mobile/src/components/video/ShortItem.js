import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Added hook
import { COLORS, SPACING } from '../../config/theme';
import likesService from '../../services/likes.service';

const { width, height } = Dimensions.get('window');
// Adjust height to account for bottom tab bar (approx 60-80px)
const SCREEN_HEIGHT = height - 60; 

const ShortItem = ({ item, isActive }) => {
  const navigation = useNavigation(); // Initialize navigation
  const [paused, setPaused] = useState(!isActive);
  const [liked, setLiked] = useState(false); // Optimistic UI
  const [likeCount, setLikeCount] = useState(item.likes_count || 0);

  // Update paused state when active status changes (scrolling)
  useEffect(() => {
    setPaused(!isActive);
  }, [isActive]);

  const handleLike = async () => {
    // 1. Optimistic Update (Instant feedback)
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

    // 2. API Call
    try {
      await likesService.toggleLike('short', item.id);
    } catch (error) {
      // Revert if failed
      setLiked(!newLikedState);
      setLikeCount(prev => newLikedState ? prev - 1 : prev + 1);
      console.error('Like failed', error);
    }
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={togglePause}>
        <Video
          source={{ uri: item.video_url }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={paused}
          // Prevent audio mixing with music apps if needed
          ignoreSilentSwitch="ignore" 
          playInBackground={false}
          playWhenInactive={false}
        />
      </TouchableWithoutFeedback>

      {/* Overlay UI */}
      <View style={styles.overlay}>
        
        {/* Right Side Actions */}
        <View style={styles.rightColumn}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons 
              name={liked ? "heart" : "heart-outline"} 
              size={35} 
              color={liked ? COLORS.error : COLORS.text} 
            />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={32} color={COLORS.text} />
            <Text style={styles.actionText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={32} color={COLORS.text} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.creatorName}>@{item.creator?.full_name || 'Creator'}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.title}
          </Text>
          {item.course && (
            <TouchableOpacity 
              style={styles.courseLink}
              onPress={() => navigation.navigate('CourseDetail', { courseId: item.course.id })}
            >
              <Ionicons name="school" size={16} color={COLORS.text} />
              <Text style={styles.courseLinkText}>Learn: {item.course.title}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: SCREEN_HEIGHT,
    backgroundColor: 'black',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    bottom: 20, // Push up slightly
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bottomInfo: {
    flex: 1,
    marginRight: 60, // Make room for right buttons
    paddingBottom: 10,
  },
  creatorName: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  rightColumn: {
    position: 'absolute',
    right: 10,
    bottom: 50,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  actionText: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: 4,
  },
  courseLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: SPACING.sm,
    borderRadius: 8,
    marginTop: SPACING.xs,
    alignSelf: 'flex-start',
  },
  courseLinkText: {
    color: COLORS.text,
    marginHorizontal: SPACING.xs,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ShortItem;