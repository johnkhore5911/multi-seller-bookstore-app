// src/screens/auth/WelcomeScreen.js
import React from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor={colors.primary} barStyle="light-content" /> */}
      
      {/* Header Section with App Branding */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="library" size={60} color={colors.primary} />
          <Text style={styles.appName}>BookStore</Text>
          <Text style={styles.appTagline}>Multi-Seller Marketplace</Text>
        </View>
      </View>

      {/* Hero Image Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ 
            uri: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80' 
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>Welcome to Our Bookstore</Text>
        <Text style={styles.welcomeSubtitle}>
          Discover thousands of books from multiple sellers or start selling your own collection
        </Text>

        {/* Feature Pills */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="storefront-outline" size={16} color={colors.primary} />
            <Text style={styles.featureText}>Buy Books</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="business-outline" size={16} color={colors.primary} />
            <Text style={styles.featureText}>Sell Books</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
            <Text style={styles.featureText}>Secure</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Login to Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Create New Account</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  appTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  heroImage: {
    width: width * 0.75,
    height: width * 0.5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    // paddingTop: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    // marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    // marginBottom: 32,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 6,
    fontWeight: '600',
  },
  actionSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
