import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await login('demo@lazorkit.com', 'Demo User');
    } catch (err) {
      setError((err as any).message || 'Login failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles. content}>
        <Text style={styles.title}>🎁 Lazorkit Tipper</Text>
        <Text style={styles.subtitle}>Send SOL tips without gas fees</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Connect with Passkey</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>Biometric authentication • No seed phrases needed</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding:  12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f00',
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});