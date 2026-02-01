import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING } from '../../config/theme';
import api from '../../services/api'; // Direct API usage for simple fetch

const ExploreScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching categories', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.iconContainer}>
        <Ionicons name="library" size={24} color={COLORS.primary} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSub} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses, skills..."
            placeholderTextColor={COLORS.textSub}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={renderCategory}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingTop: SPACING.xl },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  searchInput: { flex: 1, color: COLORS.text, marginLeft: SPACING.sm, fontSize: 16 },
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  row: { justifyContent: 'space-between' },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryName: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
});

export default ExploreScreen;