import { useWallet as useLazorWallet } from '@lazorkit/wallet';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';

// Using the RPC URL from the requirements
const RPC_URL = 'https://api.devnet.solana.com';

export function useLazor() {
    const {
        isConnected,
        isConnecting,
        wallet,
        connect: originalConnect,
        disconnect,
        signAndSendTransaction: originalSignAndSend,
    } = useLazorWallet();

    const [balance, setBalance] = useState<number>(0);

    // Derive public key from wallet info
    const publicKey = wallet?.smartWallet ? new PublicKey(wallet.smartWallet) : null;

    // Function to fetch balance
    const fetchBalance = useCallback(async () => {
        if (!publicKey) {
            setBalance(0);
            return;
        }

        try {
            const connection = new Connection(RPC_URL);
            const lamports = await connection.getBalance(publicKey);
            setBalance(lamports / LAMPORTS_PER_SOL);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    }, [publicKey]);

    // Fetch balance when connected or publicKey changes
    useEffect(() => {
        fetchBalance();

        // Optional: Set up a subscription or interval for balance updates
        const interval = setInterval(fetchBalance, 10000); // Update every 10s
        return () => clearInterval(interval);
    }, [fetchBalance]);

    // Wrap connect to match expected interface if needed, or just expose it
    const connect = useCallback(async () => {
        try {
            await originalConnect();
        } catch (error) {
            console.error('Connection failed:', error);
            throw error;
        }
    }, [originalConnect]);

    // Wrap signAndSendTransaction to be more user friendly if needed
    // The SDK expects { instructions, transactionOptions? }
    // We will expose it as is for now, but GaslessTip might need to construct instructions.
    const signAndSendTransaction = originalSignAndSend;

    return {
        isConnected,
        isConnecting,
        publicKey,
        balance,
        connect,
        disconnect,
        signAndSendTransaction,
        refreshBalance: fetchBalance,
    };
}
