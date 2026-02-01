import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Dimensions, 
  Text
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ShortItem from '../../components/video/ShortItem';
import shortsService from '../../services/shorts.service';
import { COLORS } from '../../config/theme';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeShortIndex, setActiveShortIndex] = useState(0);
  
  // Dynamic height adjustment for tab bar
  let tabBarHeight = 0;
  try { tabBarHeight = useBottomTabBarHeight(); } catch (e) {}
  
  const SCREEN_HEIGHT = height - tabBarHeight;

  // 1. Fetch Data
  const fetchShorts = async () => {
    try {
      const data = await shortsService.getFeed();
      // Handle both array response or object with { shorts: [] }
      const newShorts = Array.isArray(data) ? data : (data.shorts || []);
      setShorts(newShorts);
    } catch (error) {
      console.log('Error fetching shorts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  // 2. Viewability Config (Which item is visible?)
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveShortIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item considered visible if >50% shown
  }).current;

  // 3. Render
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (shorts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{color: 'white'}}>No shorts found. Create one?</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={shorts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={{ height: SCREEN_HEIGHT }}>
            <ShortItem 
              item={item} 
              isActive={index === activeShortIndex} 
            />
          </View>
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        // Optimization props
        windowSize={3}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default HomeScreen;