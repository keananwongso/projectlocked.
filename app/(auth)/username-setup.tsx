// Username setup screen after first sign-in
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import { checkUsernameAvailable } from '../../src/services/auth';

export default function UsernameSetupScreen() {
  const { setupProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced username check
  useEffect(() => {
    if (username.length < 3) {
      setAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const isAvailable = await checkUsernameAvailable(username);
        setAvailable(isAvailable);
      } catch (err) {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async () => {
    if (!available || username.length < 3 || !fullName.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await setupProfile(username, fullName.trim());
      // Navigation handled by root layout auth check
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = username.length >= 3 && available && fullName.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose your username</Text>
        <Text style={styles.subtitle}>This is how friends will find you</Text>

        {/* Username Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.usernameRow}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              value={username}
              onChangeText={(text) =>
                setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ''))
              }
              placeholder="yourname"
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              style={styles.usernameInput}
            />
            {checking && <ActivityIndicator size="small" color="#6366F1" />}
            {!checking && available === true && (
              <Text style={styles.checkmark}>✓</Text>
            )}
            {!checking && available === false && (
              <Text style={styles.xmark}>✗</Text>
            )}
          </View>
          {available === false && (
            <Text style={styles.unavailable}>Username taken</Text>
          )}
        </View>

        {/* Full Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your Name"
            placeholderTextColor="#6B7280"
            maxLength={50}
            style={styles.input}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isValid || submitting}
          style={[styles.button, !isValid && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {submitting ? 'Creating...' : 'Continue'}
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
    paddingHorizontal: 32,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    marginBottom: 32,
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#D1D5DB',
    marginBottom: 8,
    fontSize: 16,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atSymbol: {
    color: '#6B7280',
    fontSize: 18,
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    backgroundColor: '#1F2937',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 18,
  },
  input: {
    backgroundColor: '#1F2937',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 18,
  },
  checkmark: {
    color: '#4ADE80',
    marginLeft: 12,
    fontSize: 18,
  },
  xmark: {
    color: '#F87171',
    marginLeft: 12,
    fontSize: 18,
  },
  unavailable: {
    color: '#F87171',
    fontSize: 14,
    marginTop: 4,
  },
  error: {
    color: '#F87171',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#374151',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
