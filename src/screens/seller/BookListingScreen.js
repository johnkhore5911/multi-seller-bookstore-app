import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';
import { BookCard, LoadingSpinner, EmptyState, Header, SearchBar } from '../../components';
import { fetchSellerBooks, deleteBook } from '../../services/bookService';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // Two columns with padding, same as buyer screen

export default function BookListingScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  useEffect(() => {
    filterBooks();
  }, [searchQuery, books]);

  const loadBooks = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const data = await fetchSellerBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (e) {
      setError('Failed to load your books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBooks(false);
    setRefreshing(false);
  }, []);

  const filterBooks = () => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    }
  };

  const handleEditBook = (book) => {
    navigation.navigate('EditBook', { bookId: book.id });
  };

  const handleDeleteBook = (bookId) => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to permanently delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(bookId);
              loadBooks(false);
              Alert.alert('Success', 'Book has been deleted.');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete the book.');
            }
          },
        },
      ]
    );
  };

  const handleAddBook = () => {
    navigation.navigate('AddBook');
  };

  // Updated render function to match buyer screen layout
  const renderSellerBookCard = ({ item, index }) => (
    <View style={[styles.bookItemContainer, { width: ITEM_WIDTH }]}>
      <BookCard 
        book={item} 
        showSellerName={false}
        style={styles.bookCard}
      />
      <View style={styles.actionsOverlay}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.secondary }]}
          onPress={() => handleEditBook(item)}
        >
          <Ionicons name="pencil" size={18} color={colors.background} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={() => handleDeleteBook(item.id)}
        >
          <Ionicons name="trash" size={18} color={colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.pageTitle}>My Book Listings</Text>
      <Text style={styles.subtitle}>Manage your inventory and view your listed books.</Text>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header 
        title="My Books"
        rightButton="add-circle-outline"
        onRightPress={handleAddBook}
      />

      {/* Search Bar - moved outside of list header */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search your books..."
        onClear={() => setSearchQuery('')}
      />

      {loading ? (
        <LoadingSpinner text="Loading your books..." />
      ) : error ? (
        <EmptyState
          icon="alert-circle-outline"
          message={error}
          actionButton="Try Again"
          onActionPress={() => loadBooks()}
        />
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderSellerBookCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row} // Added this for proper spacing
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon="book-outline"
              message="No books listed yet"
              subMessage="Tap the '+' button to add your first book and start selling!"
              actionButton="Add Your First Book"
              onActionPress={handleAddBook}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      {!loading && !error && (
        <TouchableOpacity style={styles.fab} onPress={handleAddBook}>
          <Ionicons name="add" size={32} color={colors.background} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 100, // Extra padding for floating button
  },
  headerSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bookItemContainer: {
    marginBottom: 16,
    position: 'relative', // For action buttons overlay
  },
  bookCard: {
    width: '100%',
    margin: 0, // Remove default BookCard margin
  },
  actionsOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    padding: 6,
  },
  actionButton: {
    marginHorizontal: 3,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90, // Above the tab bar, same as buyer screen
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
