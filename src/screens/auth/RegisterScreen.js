// src/screens/auth/RegisterScreen.js
import React, { useState,useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { CustomInput, CustomButton } from '../../components';
import { register } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' // Default role
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain letters and numbers';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleRoleSwitch = (newRole) => {
    setFormData(prev => ({ ...prev, role: newRole }));
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role
      });

      Alert.alert(
        'Registration Successful!',
        `Welcome ${formData.name}! Your account has been created successfully. You can now login.`,
        [
          {
            text: 'Login Now',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );

    } catch (error) {
      let errorMessage = 'An error occurred during registration. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
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
                <Ionicons name="person-add" size={50} color={colors.primary} />
              </View>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our bookstore community today</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <CustomInput
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter your full name"
              error={errors.name}
              editable={!loading}
            />

            <CustomInput
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email address"
              keyboardType="email-address"
              error={errors.email}
              editable={!loading}
            />

            <View style={styles.passwordContainer}>
              <CustomInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Create a password"
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

            <View style={styles.passwordContainer}>
              <CustomInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                error={errors.confirmPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Role Selection */}
            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>I want to:</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    formData.role === 'buyer' && styles.roleOptionActive
                  ]}
                  onPress={() => handleRoleSwitch('buyer')}
                  disabled={loading}
                >
                  <Ionicons 
                    name="storefront" 
                    size={24} 
                    color={formData.role === 'buyer' ? colors.background : colors.primary} 
                  />
                  <Text style={[
                    styles.roleText,
                    formData.role === 'buyer' && styles.roleTextActive
                  ]}>
                    Buy Books
                  </Text>
                  <Text style={[
                    styles.roleDescription,
                    formData.role === 'buyer' && styles.roleDescriptionActive
                  ]}>
                    Browse and purchase books
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    formData.role === 'seller' && styles.roleOptionActive
                  ]}
                  onPress={() => handleRoleSwitch('seller')}
                  disabled={loading}
                >
                  <Ionicons 
                    name="business" 
                    size={24} 
                    color={formData.role === 'seller' ? colors.background : colors.primary} 
                  />
                  <Text style={[
                    styles.roleText,
                    formData.role === 'seller' && styles.roleTextActive
                  ]}>
                    Sell Books
                  </Text>
                  <Text style={[
                    styles.roleDescription,
                    formData.role === 'seller' && styles.roleDescriptionActive
                  ]}>
                    List and sell your books
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <CustomButton
              title={loading ? 'Creating Account...' : 'Create Account'}
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
            />

            {/* Terms and Conditions */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <TouchableOpacity onPress={navigateToLogin} disabled={loading}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Sign In</Text>
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
    paddingBottom: 20,
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
  roleSection: {
    marginVertical: 20,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  roleOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  roleTextActive: {
    color: colors.background,
  },
  roleDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  roleDescriptionActive: {
    color: colors.background,
    opacity: 0.9,
  },
  registerButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
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
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
