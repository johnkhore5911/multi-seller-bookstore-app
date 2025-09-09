// src/screens/buyer/StorefrontScreen.js
import React, { useState, useEffect, useCallback, useContext  } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { BookCard, LoadingSpinner, EmptyState, Header, SearchBar } from '../../components';
import { fetchAllBooks } from '../../services/bookService';
import { AuthContext } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // Two columns with padding

export default function StorefrontScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const { switchRole } = useContext(AuthContext);

  // Load user data and books on component mount
  useEffect(() => {
    loadUserData();
    loadBooks();
  }, []);

  // Filter books based on search query
  useEffect(() => {
    filterBooks();
  }, [searchQuery, books]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadBooks = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    
    try {
      const booksData = await fetchAllBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadBooks(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const filterBooks = () => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query) ||
        book.seller_name?.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    }
  };

  const handleBookPress = (book) => {
    navigation.navigate('ProductDetail', { book });
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleRoleSwitch = () => {
    Alert.alert(
      'Switch to Seller Mode',
      'Do you want to switch to Seller mode to manage your books?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: async () => {
            // await AsyncStorage.setItem('userRole', 'seller');
            // Navigation will be handled by AppNavigator
            try {
              // Use the switchRole function from context
              await switchRole('seller');
              // AppNavigator will automatically detect this change and switch to SellerTabNavigator
            } catch (error) {
              console.error('Error switching role:', error);
              Alert.alert('Error', 'Failed to switch to seller mode. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderBookItem = ({ item, index }) => (
    <View style={[styles.bookItemContainer, { width: ITEM_WIDTH }]}>
      <BookCard
        book={item}
        onPress={handleBookPress}
        showSellerName={true}
        style={styles.bookCard}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeText}>
        {userName ? `Welcome back, ${userName}!` : 'Welcome to our Bookstore!'}
      </Text>
      <Text style={styles.welcomeSubtext}>
        Discover amazing books from our sellers
      </Text>
    </View>
  );

  const renderEmptyComponent = () => {
    if (searchQuery.trim() !== '') {
      return (
        <EmptyState
          icon="search-outline"
          message="No books found"
          subMessage={`No results found for "${searchQuery}"`}
          actionButton="Clear Search"
          onActionPress={handleSearchClear}
        />
      );
    }

    return (
      <EmptyState
        icon="library-outline"
        message="No books available"
        subMessage="Be the first to add books to our marketplace!"
        actionButton="Switch to Seller Mode"
        onActionPress={handleRoleSwitch}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header 
          title="Bookstore" 
          rightButton="person-outline"
          onRightPress={() => navigation.navigate('Profile')}
        />
        <LoadingSpinner text="Loading books..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Custom Header with Profile Button */}
      <Header 
        title="Bookstore" 
        rightButton="person-outline"
        onRightPress={() => navigation.navigate('Profile')}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleSearchClear}
        placeholder="Search books or sellers..."
      />

      {/* Results Count */}
      {searchQuery.trim() !== '' && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredBooks.length} result{filteredBooks.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}

      {error ? (
        <EmptyState
          icon="alert-circle-outline"
          message="Oops! Something went wrong"
          subMessage={error}
          actionButton="Try Again"
          onActionPress={() => loadBooks()}
        />
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={searchQuery.trim() === '' ? renderHeader : null}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button for Role Switch */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleRoleSwitch}
        activeOpacity={0.8}
      >
        <Ionicons name="swap-horizontal" size={24} color={colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  resultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 100, // Extra padding for floating button
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bookItemContainer: {
    marginBottom: 16,
  },
  bookCard: {
    width: '100%',
    margin: 0, // Remove default BookCard margin
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90, // Above the tab bar
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
