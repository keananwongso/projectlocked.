// Login screen
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/hooks/useAuth';
import { useState } from 'react';
import { DEMO_MODE } from '../../src/utils/constants';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Brand */}
        <View style={styles.brand}>
          <Text style={styles.logo}>🔒</Text>
          <Text style={styles.title}>ProjectLocked</Text>
          <Text style={styles.subtitle}>Lock in. Prove it. Level up.</Text>
          {DEMO_MODE && (
            <View style={styles.demoBadge}>
              <Text style={styles.demoText}>DEMO MODE</Text>
            </View>
          )}
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          style={[styles.signInButton, loading && styles.buttonDisabled]}
        >
          <Text style={styles.signInText}>
            {loading ? 'Signing in...' : 'Get Started'}
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  subtitle: {
    color: '#9CA3AF',
    marginTop: 8,
    fontSize: 16,
  },
  demoBadge: {
    backgroundColor: '#CA8A04',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 16,
  },
  demoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  signInButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 9999,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    color: '#F87171',
    marginTop: 16,
    textAlign: 'center',
  },
  footer: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 32,
    textAlign: 'center',
  },
});
