import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { COLORS, SPACING } from '../../config/theme';

const SignupScreen = ({ navigation }) => {
  const { signup } = useContext(AuthContext);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signup(fullName, email, password);
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the community today</Text>
          </View>

          <View style={styles.form}>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <CustomInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />

            <CustomInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <CustomInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <CustomButton 
              title="Sign Up" 
              onPress={handleSignup} 
              loading={loading}
            />

            <TouchableOpacity 
              style={styles.footerLink} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.footerText}>
                Already have an account? <Text style={styles.highlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
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

export default SignupScreen;