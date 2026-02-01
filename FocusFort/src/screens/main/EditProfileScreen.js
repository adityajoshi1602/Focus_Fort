import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { COLORS, SPACING } from '../../config/theme';
import CustomButton from '../../components/common/CustomButton';
import api from '../../services/api';

const EditProfileScreen = ({ navigation }) => {
  const { userInfo, setUserInfo } = useContext(AuthContext); // You might need to expose setUserInfo in Context
  
  const [bio, setBio] = useState(userInfo?.bio || '');
  const [username, setUsername] = useState(userInfo?.username || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Call Backend API to update user
      const { data } = await api.put('/users/profile', { bio, username });
      
      // Update Local State
      setUserInfo({ ...userInfo, bio, username });
      
      Alert.alert('Success', 'Profile updated!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput 
        style={styles.input} 
        value={username} 
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={bio} 
        onChangeText={setBio} 
        multiline
        placeholder="Tell us about yourself..."
        placeholderTextColor={COLORS.textSub}
      />

      <CustomButton title="Save Changes" onPress={handleSave} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  label: { color: COLORS.textSub, marginBottom: 8, fontSize: 14 },
  input: { 
    backgroundColor: COLORS.surface, 
    color: COLORS.text, 
    padding: SPACING.md, 
    borderRadius: 8, 
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  textArea: { height: 100, textAlignVertical: 'top' }
});

export default EditProfileScreen;