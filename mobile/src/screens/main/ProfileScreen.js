import React, { useContext, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    TouchableOpacity // <--- THIS WAS MISSING
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { COLORS, SPACING } from '../../config/theme';
import CustomButton from '../../components/common/CustomButton';
import enrollmentService from '../../services/enrollment.service';
import { creatorApi } from '../../services/api';

const ProfileScreen = () => {
    const { logout, userInfo } = useContext(AuthContext);
    const navigation = useNavigation();
    const [stats, setStats] = useState({ courses: 0, completed: 0 });
    const [applying, setApplying] = useState(false);

    useFocusEffect(
        useCallback(() => { loadStats(); }, [])
    );

    const loadStats = async () => {
        try {
            const data = await enrollmentService.getMyEnrollments();
            const completed = data.filter(e => e.progress_percentage === 100).length;
            setStats({ courses: data.length, completed });
        } catch (error) { console.log(error); }
    };

    const handleApplyCreator = async () => {
        setApplying(true);
        try {
            await creatorApi.apply();
            Alert.alert('Application Submitted', 'An admin will review your request shortly.');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>{userInfo?.full_name?.charAt(0).toUpperCase()}</Text>
                    </View>
                </View>
                <Text style={styles.name}>{userInfo?.full_name}</Text>

                {/* Edit Profile Button */}
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>

                {/* Role Badge */}
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{userInfo?.role?.toUpperCase()}</Text>
                </View>
                {userInfo?.is_admin && <Text style={styles.adminText}>• Administrator •</Text>}
            </View>

            {/* Admin Section */}
            {userInfo?.is_admin && (
                <View style={styles.section}>
                    <CustomButton
                        title="Admin Dashboard"
                        onPress={() => navigation.navigate('AdminDashboard')}
                        variant="primary"
                    />
                </View>
            )}
            {userInfo?.role === 'creator' && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Creator Mode</Text>
                    <CustomButton
                        title="Open Creator Studio"
                        onPress={() => navigation.navigate('CreatorDashboard')}
                        variant="primary"
                    />
                </View>
            )}

            {/* Creator Application Section */}
            {!userInfo?.is_admin && userInfo?.role === 'explorer' && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Become a Creator</Text>
                    <Text style={styles.sectionDesc}>Share your knowledge and create courses.</Text>
                    <CustomButton
                        title="Apply Now"
                        onPress={handleApplyCreator}
                        loading={applying}
                        variant="outline"
                    />
                </View>
            )}

            <View style={styles.logoutContainer}>
                <CustomButton title="Log Out" onPress={logout} variant="outline" style={{ borderColor: COLORS.error }} textStyle={{ color: COLORS.error }} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { alignItems: 'center', paddingTop: SPACING.xl * 2, paddingBottom: SPACING.lg },
    avatarContainer: { marginBottom: SPACING.md },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    avatarPlaceholder: { backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
    avatarText: { fontSize: 40, color: COLORS.primary, fontWeight: 'bold' },
    name: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 5 },
    editProfileText: { color: COLORS.primary, fontSize: 14, marginBottom: 10, fontWeight: '600' }, // Added style for the link
    badge: { backgroundColor: COLORS.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    badgeText: { color: COLORS.textSub, fontSize: 12, fontWeight: 'bold' },
    adminText: { color: COLORS.secondary, marginTop: 8, fontWeight: 'bold' },
    section: { margin: SPACING.lg, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: 12 },
    sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    sectionDesc: { color: COLORS.textSub, marginBottom: 15 },
    logoutContainer: { padding: SPACING.lg },
});

export default ProfileScreen;