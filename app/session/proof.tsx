// Proof capture screen - Camera/ImagePicker for before/after photos
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSessionStore } from '../../src/stores/sessionStore';

export default function ProofScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'before' | 'after' }>();
  const { submitBeforeProof, submitAfterProof, clearSession } = useSessionStore();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    try {
      // Request permissions
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission needed',
            'Camera permission is required to take proof photos'
          );
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission needed',
            'Photo library permission is required'
          );
          return;
        }
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) return;

    setUploading(true);
    try {
      if (type === 'before') {
        await submitBeforeProof(imageUri);
        router.replace('/session/active');
      } else {
        await submitAfterProof(imageUri);
        clearSession();
        router.replace('/(tabs)');
        Alert.alert('Session Complete!', 'Great work! Your session has been saved.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload Failed', 'Please try again');
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    if (type === 'before') {
      router.replace('/session/active');
    } else {
      clearSession();
      router.replace('/(tabs)');
    }
  };

  const isBefore = type === 'before';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>
          {isBefore ? '📸 Before Proof' : '🏆 After Proof'}
        </Text>
        <Text style={styles.subtitle}>
          {isBefore
            ? "Show your friends what you're about to work on"
            : 'Show what you accomplished!'}
        </Text>

        {/* Image Preview or Picker */}
        <View style={styles.imageSection}>
          {imageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <TouchableOpacity
                onPress={() => setImageUri(null)}
                style={styles.retakeButton}
              >
                <Text style={styles.retakeText}>Retake Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                onPress={() => pickImage(true)}
                style={styles.cameraButton}
              >
                <Text style={styles.cameraButtonText}>📷 Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => pickImage(false)}
                style={styles.libraryButton}
              >
                <Text style={styles.libraryButtonText}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.footer}>
        {imageUri && (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={uploading}
            style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
          >
            <Text style={styles.submitButtonText}>
              {uploading ? 'Uploading...' : 'Submit Proof'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>
            {isBefore ? 'Skip for now' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 24,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
  },
  previewContainer: {
    alignItems: 'center',
  },
  preview: {
    width: 288,
    height: 288,
    borderRadius: 20,
  },
  retakeButton: {
    marginTop: 16,
  },
  retakeText: {
    color: '#818CF8',
    fontSize: 16,
  },
  pickerContainer: {
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  libraryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  libraryButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  submitButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#374151',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
