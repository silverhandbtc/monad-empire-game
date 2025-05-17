'use client';

import env from '@/config/env';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface ConnectedWallet {
  id: string;
  name: string;
  address: string;
  type: 'evm';
  network: string;
}

interface WalletContextType {
  connectedWallet: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const MONAD_NETWORK = {
  chainId: env.NEXT_PUBLIC_MONAD_CHAIN_ID,
  chainName: env.NEXT_PUBLIC_MONAD_CHAIN_NAME,
  nativeCurrency: {
    name: env.NEXT_PUBLIC_MONAD_NAME,
    symbol: env.NEXT_PUBLIC_MONAD_SYMBOL,
    decimals: env.NEXT_PUBLIC_MONAD_DECIMAL,
  },
  rpcUrls: [env.NEXT_PUBLIC_MONAD_RPC_URL],
  blockExplorerUrls: [env.NEXT_PUBLIC_MONAD_EXPLORER_URL],
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const checkNetwork = useCallback((currentChainId: string) => {
    setChainId(currentChainId);
    setIsCorrectNetwork(currentChainId === env.NEXT_PUBLIC_MONAD_CHAIN_ID);
  }, []);

  const switchToMonadNetwork = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask not found!');
      }

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: env.NEXT_PUBLIC_MONAD_CHAIN_ID }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_NETWORK],
          });
        } else {
          throw switchError;
        }
      }

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      checkNetwork(chainId);
    } catch (error) {
      console.error('Error switching network:', error);

      if (error.code === 4001) {
        setError('You rejected the network switch.');
      } else {
        setError(error.message || 'Error switching network');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, checkNetwork]);

  const connectWallet = useCallback(async () => {
    if (isLoading) return;

    setError(null);

    try {
      setIsLoading(true);

      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error(
          'MetaMask not found! Please install the MetaMask extension.',
        );
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const accountConnected = accounts[0];
      if (accountConnected) {
        setAccount(accountConnected);
        setConnectedWallet(accountConnected);

        localStorage.setItem('monad-game-wallet-connected', 'true');
        localStorage.setItem('monad-game-wallet-address', accountConnected);

        console.log('Account connected:', accounts[0]);
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        checkNetwork(chainId);
      } else {
        throw new Error('No account authorized!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);

      if (error.code === 4001) {
        setError('You rejected the connection with MetaMask.');
      } else {
        setError(`Connection error: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, checkNetwork]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setIsCorrectNetwork(false);
    setTransactionStatus('idle');
    setTransactionHash(null);
    setConnectedWallet(null);

    localStorage.removeItem('monad-game-wallet-connected');
    localStorage.removeItem('monad-game-wallet-address');
  }, []);

  const sendTestTransaction = useCallback(async () => {
    if (isTransactionLoading || !account || !isCorrectNetwork) return;

    try {
      setIsTransactionLoading(true);
      setTransactionStatus('pending');
      setTransactionHash(null);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask not found!');
      }

      const transactionParameters = {
        to: account, // Send to own address
        from: account,
        value: '0x0', // 0 MON
        data: '0x', // Empty data
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      setTransactionHash(txHash);
      setTransactionStatus('success');
    } catch (error) {
      console.error('Error sending transaction:', error);
      setTransactionStatus('error');

      if (error.code === 4001) {
        setError('You rejected the transaction.');
      } else {
        setError(`Transaction error: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsTransactionLoading(false);
    }
  }, [account, isCorrectNetwork, isTransactionLoading]);

  useEffect(() => {
    const attemptAutoConnect = async () => {
      try {
        const walletConnected =
          localStorage.getItem('monad-game-wallet-connected') === 'true';
        const savedAddress = localStorage.getItem('monad-game-wallet-address');

        if (
          !walletConnected ||
          !savedAddress ||
          typeof window === 'undefined' ||
          !window.ethereum
        ) {
          return;
        }

        setIsConnecting(true);

        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.includes(savedAddress)) {
          setAccount(savedAddress);
          setConnectedWallet(savedAddress);

          const chainId = await window.ethereum.request({
            method: 'eth_chainId',
          });

          checkNetwork(chainId);
        } else {
          localStorage.removeItem('monad-game-wallet-connected');
          localStorage.removeItem('monad-game-wallet-address');
        }
      } catch (error) {
        console.error('Error during auto-connect:', error);
        localStorage.removeItem('monad-game-wallet-connected');
        localStorage.removeItem('monad-game-wallet-address');
      } finally {
        setIsConnecting(false);
      }
    };

    attemptAutoConnect();
  }, [checkNetwork]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        setConnectedWallet(accounts[0]);

        localStorage.setItem('monad-game-wallet-address', accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      checkNetwork(chainId);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [checkNetwork, disconnectWallet]);

  return (
    <WalletContext.Provider
      value={{
        connectedWallet,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
