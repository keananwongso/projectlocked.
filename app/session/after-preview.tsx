// Preview screen after taking the after proof photo
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, StatusBar, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessionStore } from '../../src/stores/sessionStore';

export default function AfterPreviewScreen() {
    const router = useRouter();
    const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { submitAfterProof, clearSession } = useSessionStore();

    const handleRetake = () => {
        router.back();
    };

    const handlePost = async () => {
        if (!photoUri) {
            Alert.alert('Error', 'No photo to submit');
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload after proof and complete session
            await submitAfterProof(photoUri);
            clearSession();
            router.replace('/(tabs)');
            Alert.alert('Session Complete!', 'Great work! Your session has been saved.');
        } catch (error) {
            console.error('Failed to submit after proof:', error);
            Alert.alert('Error', 'Failed to submit proof. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (!photoUri) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No photo available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* Header */}
            <SafeAreaView style={styles.headerContainer}>
                <View style={styles.header}>
                    <View style={{ width: 32 }} />
                    <Text style={styles.headerTitle}>Review Photo</Text>
                    <View style={{ width: 32 }} />
                </View>
            </SafeAreaView>

            {/* Photo Preview */}
            <View style={styles.previewContainer}>
                <Image 
                    source={{ uri: photoUri }} 
                    style={styles.previewImage}
                    resizeMode="contain"
                />
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
                <Text style={styles.promptText}>
                    {isSubmitting ? 'Posting your session...' : 'Happy with this photo?'}
                </Text>

                {isSubmitting ? (
                    <ActivityIndicator size="large" color="#6366F1" style={styles.loader} />
                ) : (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity 
                            style={styles.retakeButton}
                            onPress={handleRetake}
                        >
                            <Ionicons name="camera-reverse" size={24} color="white" />
                            <Text style={styles.retakeText}>Retake</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.postButton}
                            onPress={handlePost}
                        >
                            <Ionicons name="checkmark-circle" size={24} color="white" />
                            <Text style={styles.postText}>Post It!</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    headerContainer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        backgroundColor: '#111827',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    controlsContainer: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    promptText: {
        color: '#9CA3AF',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '500',
    },
    loader: {
        marginVertical: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
    },
    retakeButton: {
        flex: 1,
        backgroundColor: '#374151',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    retakeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    postButton: {
        flex: 1,
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    postText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100,
    },
});
