import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLazor } from '../hooks/useLazor';

export function GaslessTip() {
  const { publicKey, balance, signAndSendTransaction, refreshBalance } = useLazor();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!recipient || !amount || !publicKey) return;

    try {
      setIsSending(true);

      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubkey,
        lamports,
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      console.log('Transaction signature:', signature);
      Alert.alert('Success', `Tip sent! Signature: ${signature.slice(0, 8)}...`);
      
      setRecipient('');
      setAmount('');
      refreshBalance(); // Update balance
    } catch (error: any) {
      console.error('Transfer failed:', error);
      Alert.alert('Error', error.message || 'Transaction failed');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.label}>Balance</Text>
        <Text style={styles.balance}>{balance !== undefined ? balance.toFixed(4) : '...'} SOL</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.inputLabel}>Recipient Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Solana Address"
          value={recipient}
          onChangeText={setRecipient}
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>Amount (SOL)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.0"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.button, isSending && styles.buttonDisabled]}
          onPress={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Gasless Tip</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  balanceCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  balance: {
    fontSize: 32,
    fontWeight: '800',
    color: '#212529',
  },
  form: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
