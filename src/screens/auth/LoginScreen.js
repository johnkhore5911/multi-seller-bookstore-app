// src/screens/auth/LoginScreen.js
import React, { useState,useContext  } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { CustomInput, CustomButton } from '../../components';
import { login } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await login({
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      // Success - navigation will be handled by AppNavigator
      console.log('Login successful:', response.user);
      console.log('Login successful:', response.user.name);
      // if(response.user.role==='buyer') navigation.navigate('BuyerTabNavigator');
      // else navigation.navigate('SellerTabNavigator');
      
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor={colors.primary} barStyle="light-content" /> */}
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Ionicons name="library" size={50} color={colors.primary} />
              </View>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to your account to continue</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <CustomInput
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors.email}
              editable={!loading}
            />

            <View style={styles.passwordContainer}>
              <CustomInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                error={errors.password}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <CustomButton
              title={loading ? 'Signing In...' : 'Sign In'}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

            {/* Demo Credentials */}
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}>Buyer: buyer@test.com / password123</Text>
              <Text style={styles.demoText}>Seller: seller@test.com / password123</Text>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <TouchableOpacity onPress={navigateToRegister} disabled={loading}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text style={styles.registerLink}>Create Account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    flex: 1,
    marginBottom: 24,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 45,
    padding: 4,
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  demoSection: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 4,
  },
  footerSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  registerLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
