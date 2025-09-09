// src/screens/shared/ProfileScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { RoleSwitcher, CustomButton, LoadingSpinner } from '../../components';
import { logout, getCurrentUser } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  // GET switchRole AND userRole FROM CONTEXT
  const { logout, switchRole, userRole } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switchingRole, setSwitchingRole] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  // SYNC userInfo.role with context userRole whenever context changes
  useEffect(() => {
    if (userInfo && userRole && userInfo.role !== userRole) {
      setUserInfo(prev => ({ ...prev, role: userRole }));
    }
  }, [userRole, userInfo]);

  const loadUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUserInfo(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = async () => {
    if (!userInfo) return;

    // USE CONTEXT ROLE for current role, not local state
    const currentRole = userRole || userInfo.role;
    const newRole = currentRole === 'buyer' ? 'seller' : 'buyer';
    
    Alert.alert(
      'Switch Mode',
      `Switch to ${newRole === 'buyer' ? 'Buyer' : 'Seller'} mode?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: async () => {
            setSwitchingRole(true);
            try {
              // USE CONTEXT'S switchRole METHOD
              await switchRole(newRole);
              
              // Update local state immediately for UI
              setUserInfo(prev => ({ ...prev, role: newRole }));
              
              Alert.alert(
                'Mode Switched!',
                `You are now in ${newRole === 'buyer' ? 'Buyer' : 'Seller'} mode.`,
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Error switching role:', error);
              Alert.alert('Error', 'Failed to switch mode. Please try again.');
            } finally {
              setSwitchingRole(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderProfileOption = (icon, title, subtitle, onPress, showChevron = true) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <LoadingSpinner text="Loading profile..." />
      </SafeAreaView>
    );
  }

  // USE CONTEXT ROLE for current active role
  const currentRole = userRole || userInfo?.role;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons 
                name="person" 
                size={40} 
                color={colors.background} 
              />
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{userInfo?.email || 'user@example.com'}</Text>
            <View style={styles.roleContainer}>
              <View style={[
                styles.roleBadge,
                { backgroundColor: currentRole === 'seller' ? colors.secondary : colors.primary }
              ]}>
                <Ionicons 
                  name={currentRole === 'seller' ? 'business' : 'storefront'} 
                  size={14} 
                  color={colors.background} 
                />
                <Text style={styles.roleText}>
                  {currentRole === 'seller' ? 'Seller' : 'Buyer'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Role Switcher Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity 
              style={styles.roleSwitchContainer}
              onPress={handleRoleSwitch}
              disabled={switchingRole}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <Ionicons name="swap-horizontal" size={24} color={colors.primary} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    Switch to {currentRole === 'buyer' ? 'Seller' : 'Buyer'} Mode
                  </Text>
                  <Text style={styles.optionSubtitle}>
                    {currentRole === 'buyer' 
                      ? 'Start selling your books' 
                      : 'Browse and buy books'
                    }
                  </Text>
                </View>
              </View>
              {switchingRole ? (
                <LoadingSpinner size="small" style={styles.switchLoader} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.sectionContent}>
            {currentRole === 'buyer' ? (
              <>
                {renderProfileOption(
                  'storefront-outline',
                  'Browse Books',
                  'Explore our bookstore',
                  () => navigation.navigate('Storefront')
                )}
                {renderProfileOption(
                  'cart-outline',
                  'My Cart',
                  'View items in cart',
                  () => navigation.navigate('Cart')
                )}
                {renderProfileOption(
                  'receipt-outline',
                  'My Orders',
                  'Track your orders',
                  () => navigation.navigate('Orders')
                )}
              </>
            ) : (
              <>
                {renderProfileOption(
                  'book-outline',
                  'My Books',
                  'Manage your inventory',
                  () => navigation.navigate('BookListing')
                )}
                {renderProfileOption(
                  'stats-chart-outline',
                  'Sales Dashboard',
                  'View your sales',
                  () => navigation.navigate('Dashboard')
                )}
                {renderProfileOption(
                  'receipt-outline',
                  'Orders',
                  'Manage customer orders',
                  () => navigation.navigate('Orders')
                )}
              </>
            )}
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            {renderProfileOption(
              'person-outline',
              'Edit Profile',
              'Update your information',
              () => Alert.alert('Coming Soon', 'Profile editing will be available soon!')
            )}
            {renderProfileOption(
              'notifications-outline',
              'Notifications',
              'Manage your preferences',
              () => Alert.alert('Coming Soon', 'Notification settings will be available soon!')
            )}
            {renderProfileOption(
              'help-circle-outline',
              'Help & Support',
              'Get assistance',
              () => Alert.alert('Help & Support', 'For support, please contact us at support@bookstore.com')
            )}
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            {renderProfileOption(
              'information-circle-outline',
              'About App',
              'Multi-Seller Bookstore v1.0',
              () => Alert.alert(
                'About',
                'Multi-Seller Bookstore App\nVersion 1.0\n\nA platform for buying and selling books with multiple sellers.'
              ),
              false
            )}
            {renderProfileOption(
              'shield-checkmark-outline',
              'Privacy Policy',
              'Your privacy matters',
              () => Alert.alert('Privacy Policy', 'Privacy policy will be available soon!'),
              false
            )}
            {renderProfileOption(
              'document-text-outline',
              'Terms of Service',
              'App terms and conditions',
              () => Alert.alert('Terms of Service', 'Terms of service will be available soon!'),
              false
            )}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            style={styles.logoutButton}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Your existing styles remain the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  userSection: {
    backgroundColor: colors.background,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleContainer: {
    marginTop: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  switchLoader: {
    marginRight: 8,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  logoutButton: {
    backgroundColor: colors.error,
  },
  bottomSpacing: {
    height: 40,
  },
});
