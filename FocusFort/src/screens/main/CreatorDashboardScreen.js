import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../../config/theme';
import CustomButton from '../../components/common/CustomButton';
import api from '../../services/api';

const CreatorDashboardScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!title || !videoUrl) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would upload a file here. 
      // For MVP, we paste a direct video URL (e.g., from mp4 link).
      await api.post('/shorts', {
        title,
        video_url: videoUrl,
        thumbnail_url: 'https://via.placeholder.com/150', // Placeholder for now
      });

      Alert.alert('Success', 'Short uploaded successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload short');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Creator Studio</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Video Title</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Intro to React Native" 
          placeholderTextColor={COLORS.textSub}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Video URL (MP4 Link)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
          placeholderTextColor={COLORS.textSub}
          value={videoUrl}
          onChangeText={setVideoUrl}
          autoCapitalize="none"
        />
        <Text style={styles.hint}>* For this demo, paste a direct .mp4 link</Text>

        <CustomButton 
          title="Publish Short" 
          onPress={handleUpload} 
          loading={loading} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  header: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.lg },
  card: { backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: 12 },
  label: { color: COLORS.text, marginBottom: 8, fontWeight: 'bold' },
  input: { 
    backgroundColor: COLORS.background, 
    color: COLORS.text, 
    padding: SPACING.md, 
    borderRadius: 8, 
    marginBottom: SPACING.md,
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
  hint: { color: COLORS.textSub, fontSize: 12, marginBottom: SPACING.lg }
});

export default CreatorDashboardScreen;