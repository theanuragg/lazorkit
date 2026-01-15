import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useLazor } from '../hooks/useLazor';

export function LoginButton() {
  const { connect, isConnecting } = useLazor();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={connect}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Connect with Passkey</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
