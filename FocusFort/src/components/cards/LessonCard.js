import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING } from '../../config/theme';
import { formatDuration } from '../../utils/formatters';

const LessonCard = ({ lesson, index, isLocked, isCompleted, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      disabled={isLocked}
    >
      <View style={styles.leftSide}>
        <Text style={styles.index}>{index + 1}</Text>
        <View>
          <Text style={[styles.title, isLocked && styles.lockedText]}>
            {lesson.title}
          </Text>
          <Text style={styles.duration}>
            {formatDuration(lesson.duration)}
          </Text>
        </View>
      </View>
      
      <Ionicons 
        name={isCompleted ? "checkmark-circle" : (isLocked ? "lock-closed" : "play-circle")} 
        size={24} 
        color={isCompleted ? COLORS.secondary : (isLocked ? COLORS.textSub : COLORS.primary)} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  index: {
    color: COLORS.textSub,
    marginRight: SPACING.md,
    fontWeight: 'bold',
    width: 24,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  lockedText: {
    color: COLORS.textSub,
  },
  duration: {
    color: COLORS.textSub,
    fontSize: 12,
    marginTop: 2,
  },
});

export default LessonCard;