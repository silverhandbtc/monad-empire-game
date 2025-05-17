interface EthereumProvider extends BlockchainProvider {
  backpackRecognized: boolean;
  metaMaskRecognized: boolean;
  simulateMetaMask: boolean;
}

interface PhantomEthereum {
  chainId: string;
  isMetamask: boolean;
  isPhantom: boolean;
}

export declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void,
      ) => void;
    };
    phantom?: {
      ethereum?: PhantomEthereum;
    };
    backpack?: {
      ethereum?: EthereumProvider;
    };
  }
}
