export interface ApiResponse<T> {
  success: boolean;
  data:  T;
  statusCode: number;
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message:  string;
  errors?: Record<string, string[]>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserInfo {
  userId: string;
  email: string;
}

export interface WalletInfo {
  address: string;
  balance: number;
  displayName: string;
}

export interface Transaction {
  id: string;
  recipientAddress: string;
  amountSol: number;
  status: 'PENDING_SIGNATURE' | 'SIGNED' | 'CONFIRMED' | 'FAILED';
  solanaSignature?: string;
  errorMessage?: string;
  createdAt: string;
  confirmedAt?: string;
}