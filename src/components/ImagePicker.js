import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePickerLib from 'expo-image-picker';
import { colors } from '../styles/colors';

const ImagePicker = ({ onImageSelect, currentImage, style }) => {
  const pickImage = async () => {
    const { status } = await ImagePickerLib.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePickerLib.launchImageLibraryAsync({
      mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      console.log('Gallery asset:', asset); // Debug log
      
      // Create proper image object for FormData
      onImageSelect({
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        fileName: asset.fileName || `book-gallery-${Date.now()}.jpg`,
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePickerLib.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePickerLib.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      console.log('Camera asset:', asset); // Debug log
      
      // Create proper image object for FormData
      onImageSelect({
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        fileName: asset.fileName || `book-camera-${Date.now()}.jpg`,
      });
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Book Cover Image</Text>
      <TouchableOpacity style={styles.imageContainer} onPress={showImageOptions}>
        {currentImage ? (
          <Image 
            source={{ uri: typeof currentImage === 'string' ? currentImage : currentImage.uri }} 
            style={styles.image} 
            resizeMode="cover" 
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.placeholderText}>Tap to add image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});

export default ImagePicker;
