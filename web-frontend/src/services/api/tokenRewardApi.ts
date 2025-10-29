// Token Reward API Service
import axios from 'axios';

// Call directly to token-reward-service 
// Port 3000 for local development (npm run dev)
// Port 9009 for Docker deployment
const API_BASE_URL = `${import.meta.env.VITE_TOKEN_REWARD_API_URL || 'http://localhost:9009'}/api/tokens`;

// ==================== Types ====================

export interface GrantTokenRequest {
  studentId: number | string;
  amount: number;
  reasonCode?: string;
  relatedId?: number | string;
}

export interface SpendTokenRequest {
  studentId: number | string;
  amount: number;
  reasonCode?: string;
  relatedId?: number | string;
}

export interface WithdrawTokenRequest {
  studentId: number | string;
  amount: number;
  toAddress: string;
}

export interface BalanceResponse {
  balance: number;
  totalEarned?: number;
  totalSpent?: number;
}

export interface Transaction {
  id: number | string;
  studentId: number;
  amount: number;
  type: 'grant' | 'spend' | 'withdraw';
  reasonCode?: string;
  relatedId?: number | string;
  createdAt: string;
  updatedAt?: string;
}

export interface HistoryResponse {
  transactions: Transaction[];
  total: number;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  page: number;
  limit: number;
  rewards?: any[];
}

export interface WithdrawResponse {
  transactionHash?: string;
  message: string;
  success: boolean;
}

// ==================== Token Operations ====================

/**
 * Grant tokens to a user
 */
export const grantTokens = async (request: GrantTokenRequest): Promise<Transaction> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/grant`, request);
    return response.data;
  } catch (error: any) {
    console.error('Error granting tokens:', error);
    throw new Error(error.response?.data?.message || 'Failed to grant tokens');
  }
};

/**
 * Spend tokens from user balance
 */
export const spendTokens = async (request: SpendTokenRequest): Promise<Transaction> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/spend`, request);
    return response.data;
  } catch (error: any) {
    console.error('Error spending tokens:', error);
    if (error.response?.status === 400 && error.response?.data?.message === 'Insufficient funds.') {
      throw new Error('Insufficient funds.');
    }
    throw new Error(error.response?.data?.message || 'Failed to spend tokens');
  }
};

/**
 * Withdraw tokens to blockchain address
 */
export const withdrawTokens = async (request: WithdrawTokenRequest): Promise<WithdrawResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/withdraw`, request);
    return response.data;
  } catch (error: any) {
    console.error('Error withdrawing tokens:', error);
    const message = error.response?.data?.message || 'Failed to withdraw tokens';
    if (message.includes('Insufficient funds')) {
      throw new Error('Insufficient funds.');
    }
    throw new Error(message);
  }
};

// ==================== Balance & History ====================

/**
 * Get user token balance
 */
export const getBalance = async (studentId: number | string): Promise<BalanceResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/balance/${studentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting balance:', error);
    if (error.response?.status === 404) {
      throw new Error('User not found.');
    }
    throw new Error(error.response?.data?.message || 'Failed to get balance');
  }
};

/**
 * Get user transaction history
 */
export const getHistory = async (
  studentId: number | string,
  page: number = 1,
  limit: number = 10
): Promise<HistoryResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history/${studentId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting history:', error);
    throw new Error(error.response?.data?.message || 'Failed to get history');
  }
};

// ==================== Default Export ====================

const tokenRewardApi = {
  // Token Operations
  grantTokens,
  spendTokens,
  withdrawTokens,
  
  // Balance & History
  getBalance,
  getHistory,
};

export default tokenRewardApi;

