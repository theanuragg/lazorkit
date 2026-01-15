import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GaslessTip } from '../../components/GaslessTip';
import { LoginButton } from '../../components/LoginButton';
import { useLazor } from '../../hooks/useLazor';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isConnected } = useLazor();

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container, 
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Lazorkit Tipper</Text>
        <Text style={styles.subtitle}>
          {isConnected 
            ? 'Send SOL without worry' 
            : 'Secure Passkey Authentication'}
        </Text>
      </View>

      <View style={styles.content}>
        {isConnected ? (
          <GaslessTip />
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.description}>
              Connect your wallet using face ID or touch ID to start sending gasless tips.
            </Text>
            <LoginButton />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  loginContainer: {
    alignItems: 'center',
    gap: 24,
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});
