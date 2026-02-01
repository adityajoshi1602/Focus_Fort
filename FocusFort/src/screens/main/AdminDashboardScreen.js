import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING } from '../../config/theme';
import api from '../../services/api';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AdminDashboardScreen = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ID of item being processed

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // ✅ This calls the backend route: GET /api/creator/applications
      const { data } = await api.get('/creator/applications');
      setApplications(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchApplications();
    }, [])
  );

  const handleReview = async (id, action) => {
    setActionLoading(id);
    try {
      // ✅ Calls: POST /api/creator/applications/:id/review
      await api.post(`/creator/applications/${id}/review`, { action });
      
      Alert.alert('Success', `Application ${action}d!`);
      // Refresh list to remove the processed item
      fetchApplications();
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} application`);
    } finally {
      setActionLoading(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
           <Text style={styles.avatarText}>
             {item.user?.full_name?.charAt(0).toUpperCase() || 'U'}
           </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.user?.full_name || 'Unknown User'}</Text>
          <Text style={styles.email}>{item.user?.email}</Text>
          <Text style={styles.date}>Applied: {new Date(item.submitted_at).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {/* Reject Button */}
        <TouchableOpacity 
          style={[styles.btn, styles.btnReject]} 
          onPress={() => handleReview(item.id, 'reject')}
          disabled={actionLoading === item.id}
        >
          {actionLoading === item.id ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.btnText}>Reject</Text>
          )}
        </TouchableOpacity>

        {/* Approve Button */}
        <TouchableOpacity 
          style={[styles.btn, styles.btnApprove]} 
          onPress={() => handleReview(item.id, 'approve')}
          disabled={actionLoading === item.id}
        >
           {actionLoading === item.id ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.btnText}>Approve</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && applications.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Creator Requests</Text>
      
      {applications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.textSub} />
          <Text style={styles.emptyText}>All caught up! No pending requests.</Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchApplications} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, padding: SPACING.lg },
  list: { paddingHorizontal: SPACING.lg },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  avatarText: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold' },
  info: { flex: 1 },
  name: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  email: { color: COLORS.textSub, fontSize: 14 },
  date: { color: COLORS.textSub, fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  btnReject: { backgroundColor: COLORS.error },
  btnApprove: { backgroundColor: COLORS.success || '#4CAF50' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textSub, marginTop: 10, fontSize: 16 }
});

export default AdminDashboardScreen;