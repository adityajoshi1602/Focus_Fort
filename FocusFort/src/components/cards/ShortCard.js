import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING } from '../../config/theme';
import { formatCount } from '../../utils/formatters';

const ShortCard = ({ short, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      <Image source={{ uri: short.thumbnail_url }} style={styles.thumbnail} />
      <View style={styles.overlay}>
        <View style={styles.stats}>
          <Ionicons name="play" size={12} color="#FFF" />
          <Text style={styles.viewsText}>{formatCount(short.views_count)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 9/16, // Vertical video ratio
    margin: SPACING.xs,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ShortCard;