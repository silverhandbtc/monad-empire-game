'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { WalletOption } from '@/components/wallet-option';
import { useWallet } from '@/hooks/use-wallet';
import { useEffect, useState } from 'react';

const walletOptions = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'M',
    type: 'evm',
    description: 'Connect using the MetaMask wallet',
    checkInstalled: () =>
      typeof window !== 'undefined' && !!window?.ethereum?.isMetaMask,
  },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDialog({ isOpen, onClose }: WalletModalProps) {
  const { connectWallet, isConnecting } = useWallet();
  const [installedWallets, setInstalledWallets] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (isOpen) {
      const detected = walletOptions.reduce(
        (acc, wallet) => {
          acc[wallet.id] = wallet.checkInstalled();
          return acc;
        },
        {} as Record<string, boolean>,
      );

      setInstalledWallets(detected);
    }
  }, [isOpen]);

  const handleConnect = async (walletId: string) => {
    await connectWallet();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-[620px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Connect Wallet
          </DialogTitle>
          <DialogDescription className='text-sm'>
            Choose one of the wallet options below to connect
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {walletOptions.map((wallet) => (
            <WalletOption
              key={wallet.id}
              wallet={wallet}
              onClick={() => handleConnect(wallet.id)}
              disabled={isConnecting}
              isInstalled={installedWallets[wallet.id]}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
