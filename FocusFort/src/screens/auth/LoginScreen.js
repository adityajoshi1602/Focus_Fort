import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { COLORS, SPACING, FONTS } from '../../config/theme';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Navigation is handled automatically by AppNavigator switching stacks
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue learning</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <CustomInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
            />

            <CustomInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <CustomButton 
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading}
            />

            <TouchableOpacity 
              style={styles.footerLink} 
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.highlight}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSub,
  },
  form: {
    width: '100%',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  footerLink: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textSub,
    fontSize: 14,
  },
  highlight: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;