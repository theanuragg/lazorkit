import { LazorkitProvider as SDKProvider } from '@lazorkit/wallet';
import { PropsWithChildren } from 'react';

// Configuration from requirements
const CONFIG = {
  rpcUrl: 'https://api.devnet.solana.com',
  portalUrl: 'https://portal.lazor.sh',
  paymasterUrl: 'https://kora.devnet.lazorkit.com',
  paymasterApiKey: '', // Add API Key if required, otherwise leave empty
};

export function LazorProvider({ children }: PropsWithChildren) {
  // Ensure we are not blocking rendering if something fails, though SDKProvider handle it.
  // Note: SDKProvider uses View internally? It returns JSX.Element. 
  // We need to make sure it works in React Native. The SDK has 'react-native' support and 'detectPlatform'.
  
  return (
    <SDKProvider
      rpcUrl={CONFIG.rpcUrl}
      portalUrl={CONFIG.portalUrl}
      paymasterConfig={{
        paymasterUrl: CONFIG.paymasterUrl,
        apiKey: CONFIG.paymasterApiKey
      }}
    >
      {children}
    </SDKProvider>
  );
}
