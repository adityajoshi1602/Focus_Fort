import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/config/theme';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={COLORS.background} 
          translucent={false}
        />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;