import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, Dimensions, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import { COLORS, SPACING } from '../../config/theme';
import CustomButton from '../../components/common/CustomButton';
import progressService from '../../services/progress.service';
import VideoPlayer from '../../components/video/VideoPlayer';

const { width } = Dimensions.get('window');

const LessonPlayerScreen = ({ route, navigation }) => {
    const { lesson, courseId } = route.params;
    const videoRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [marking, setMarking] = useState(false);

    const handleMarkComplete = async () => {
        setMarking(true);
        try {
            await progressService.updateProgress(lesson.id, true);
            Alert.alert('Great Job!', 'Lesson marked as complete.', [
                { text: 'Next Lesson', onPress: () => navigation.goBack() } // In real app, find next ID
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update progress');
        } finally {
            setMarking(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Video Player Section */}
            <View style={styles.videoContainer}>
                <View style={styles.videoContainer}>
                    <VideoPlayer
                        source={lesson.video_url}
                        style={styles.video}
                    />
                </View>
                {loading && (
                    <View style={styles.loaderOverlay}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                )}
            </View>

            {/* Content Section */}
            <ScrollView style={styles.content}>
                <Text style={styles.title}>{lesson.title}</Text>
                <Text style={styles.description}>{lesson.description}</Text>

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Mark as Complete"
                        onPress={handleMarkComplete}
                        loading={marking}
                        variant="primary"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    videoContainer: { width: width, height: width * 0.5625, backgroundColor: 'black', position: 'relative' }, // 16:9 Aspect Ratio
    video: { width: '100%', height: '100%' },
    loaderOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    content: { padding: SPACING.md, flex: 1 },
    title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.sm },
    description: { fontSize: 14, color: COLORS.textSub, lineHeight: 22, marginBottom: SPACING.xl },
    buttonContainer: { marginTop: SPACING.md, marginBottom: SPACING.xl },
});

export default LessonPlayerScreen;