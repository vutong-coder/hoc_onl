import { useState, useEffect, useCallback } from 'react';
import { copyrightService, DocumentMetadata, DocumentCopyright, CopyrightStats } from '../services/blockchain/copyrightService';

export interface UseCopyrightReturn {
  // Connection state
  isConnected: boolean;
  currentAddress: string | null;
  connectWallet: () => Promise<boolean>;
  
  // Document operations
  registerFileDocument: (file: File, metadata: DocumentMetadata) => Promise<RegistrationResult>;
  registerTextDocument: (content: string, metadata: DocumentMetadata) => Promise<RegistrationResult>;
  verifyDocument: (documentHash: string) => Promise<VerificationResult>;
  
  // Document queries
  documentExists: (documentHash: string) => Promise<boolean>;
  getDocument: (documentHash: string) => Promise<DocumentCopyright | null>;
  getUserDocuments: (address: string) => Promise<string[]>;
  getCategoryDocuments: (category: string) => Promise<string[]>;
  searchDocuments: (partialHash: string) => Promise<string[]>;
  
  // Contract info
  getStatistics: () => Promise<CopyrightStats | null>;
  getRegistrationFee: () => Promise<string>;
  getVerificationFee: () => Promise<string>;
  
  // Document management
  updateDocument: (documentHash: string, field: 'title' | 'description', value: string) => Promise<boolean>;
  updateDocumentTags: (documentHash: string, newTags: string[]) => Promise<boolean>;
  deactivateDocument: (documentHash: string) => Promise<boolean>;
  
  // Utility functions
  calculateFileHash: (file: File) => Promise<string>;
  calculateTextHash: (content: string) => string;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

interface RegistrationResult {
  success: boolean;
  transactionHash?: string;
  documentHash?: string;
  error?: string;
}

interface VerificationResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export function useCopyright(): UseCopyrightReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = copyrightService.isWalletConnected();
        setIsConnected(connected);
        
        if (connected) {
          const address = await copyrightService.getCurrentAddress();
          setCurrentAddress(address);
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
        setIsConnected(false);
        setCurrentAddress(null);
      }
    };

    checkConnection();
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await copyrightService.connectWallet();
      setIsConnected(success);
      
      if (success) {
        const address = await copyrightService.getCurrentAddress();
        setCurrentAddress(address);
      }
      
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register file document
  const registerFileDocument = useCallback(async (
    file: File,
    metadata: DocumentMetadata
  ): Promise<RegistrationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await copyrightService.registerDocument(file, metadata);
      if (!result.success) {
        setError(result.error || 'Registration failed');
      }
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register text document
  const registerTextDocument = useCallback(async (
    content: string,
    metadata: DocumentMetadata
  ): Promise<RegistrationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await copyrightService.registerTextDocument(content, metadata);
      if (!result.success) {
        setError(result.error || 'Text registration failed');
      }
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Text registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify document
  const verifyDocument = useCallback(async (
    documentHash: string
  ): Promise<VerificationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await copyrightService.verifyDocument(documentHash);
      if (!result.success) {
        setError(result.error || 'Verification failed');
      }
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Verification failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Document queries
  const documentExists = useCallback(async (documentHash: string): Promise<boolean> => {
    try {
      return await copyrightService.documentExists(documentHash);
    } catch (err: any) {
      setError(err.message || 'Failed to check document existence');
      return false;
    }
  }, []);

  const getDocument = useCallback(async (documentHash: string): Promise<DocumentCopyright | null> => {
    try {
      return await copyrightService.getDocument(documentHash);
    } catch (err: any) {
      setError(err.message || 'Failed to get document');
      return null;
    }
  }, []);

  const getUserDocuments = useCallback(async (address: string): Promise<string[]> => {
    try {
      return await copyrightService.getUserDocuments(address);
    } catch (err: any) {
      setError(err.message || 'Failed to get user documents');
      return [];
    }
  }, []);

  const getCategoryDocuments = useCallback(async (category: string): Promise<string[]> => {
    try {
      return await copyrightService.getCategoryDocuments(category);
    } catch (err: any) {
      setError(err.message || 'Failed to get category documents');
      return [];
    }
  }, []);

  const searchDocuments = useCallback(async (partialHash: string): Promise<string[]> => {
    try {
      return await copyrightService.searchDocuments(partialHash);
    } catch (err: any) {
      setError(err.message || 'Failed to search documents');
      return [];
    }
  }, []);

  // Contract info
  const getStatistics = useCallback(async (): Promise<CopyrightStats | null> => {
    try {
      return await copyrightService.getStatistics();
    } catch (err: any) {
      setError(err.message || 'Failed to get statistics');
      return null;
    }
  }, []);

  const getRegistrationFee = useCallback(async (): Promise<string> => {
    try {
      return await copyrightService.getRegistrationFee();
    } catch (err: any) {
      setError(err.message || 'Failed to get registration fee');
      return '0';
    }
  }, []);

  const getVerificationFee = useCallback(async (): Promise<string> => {
    try {
      return await copyrightService.getVerificationFee();
    } catch (err: any) {
      setError(err.message || 'Failed to get verification fee');
      return '0';
    }
  }, []);

  // Document management
  const updateDocument = useCallback(async (
    documentHash: string,
    field: 'title' | 'description',
    value: string
  ): Promise<boolean> => {
    try {
      return await copyrightService.updateDocument(documentHash, field, value);
    } catch (err: any) {
      setError(err.message || 'Failed to update document');
      return false;
    }
  }, []);

  const updateDocumentTags = useCallback(async (
    documentHash: string,
    newTags: string[]
  ): Promise<boolean> => {
    try {
      return await copyrightService.updateDocumentTags(documentHash, newTags);
    } catch (err: any) {
      setError(err.message || 'Failed to update document tags');
      return false;
    }
  }, []);

  const deactivateDocument = useCallback(async (documentHash: string): Promise<boolean> => {
    try {
      return await copyrightService.deactivateDocument(documentHash);
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate document');
      return false;
    }
  }, []);

  // Utility functions
  const calculateFileHash = useCallback(async (file: File): Promise<string> => {
    try {
      return await copyrightService.calculateFileHash(file);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate file hash');
      return '';
    }
  }, []);

  const calculateTextHash = useCallback((content: string): string => {
    try {
      return copyrightService.calculateTextHash(content);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate text hash');
      return '';
    }
  }, []);

  return {
    // Connection state
    isConnected,
    currentAddress,
    connectWallet,
    
    // Document operations
    registerFileDocument,
    registerTextDocument,
    verifyDocument,
    
    // Document queries
    documentExists,
    getDocument,
    getUserDocuments,
    getCategoryDocuments,
    searchDocuments,
    
    // Contract info
    getStatistics,
    getRegistrationFee,
    getVerificationFee,
    
    // Document management
    updateDocument,
    updateDocumentTags,
    deactivateDocument,
    
    // Utility functions
    calculateFileHash,
    calculateTextHash,
    
    // Loading states
    isLoading,
    error
  };
}

export default useCopyright;
