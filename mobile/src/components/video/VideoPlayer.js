import React, { useState, useRef, forwardRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Text,
  TouchableOpacity
} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/theme';

const VideoPlayer = forwardRef(({ 
  source, 
  style, 
  resizeMode = "contain",
  onEnd,
  paused = false
}, ref) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(!paused);

  const handleError = (e) => {
    console.log('Video Error:', e);
    setLoading(false);
    setError(true);
  };

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  return (
    <View style={[styles.container, style]}>
      {!error ? (
        <Video
          ref={ref}
          source={{ uri: source }}
          style={styles.video}
          controls={true} // Use native controls for lessons
          resizeMode={resizeMode}
          paused={!isPlaying}
          onLoadStart={() => setLoading(true)}
          onLoad={handleLoad}
          onError={handleError}
          onEnd={onEnd}
          // Optimization props
          bufferConfig={{
            minBufferMs: 15000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000
          }}
        />
      ) : (
        <View style={styles.centerOverlay}>
          <Ionicons name="alert-circle-outline" size={40} color={COLORS.error} />
          <Text style={styles.errorText}>Failed to load video</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => setError(false)} // Simple retry trigger
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Spinner */}
      {loading && !error && (
        <View style={styles.centerOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  errorText: {
    color: '#FFF',
    marginTop: 8,
    fontSize: 14,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  retryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default VideoPlayer;