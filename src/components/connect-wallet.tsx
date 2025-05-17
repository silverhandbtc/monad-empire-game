'use client';
import { useState } from 'react';
import { WalletDialog } from './dialog/wallet-dialog';
import { Button } from './ui/button';
import { useWallet } from '@/hooks/use-wallet';
import { useRouter } from 'next/navigation';

export function ConnectWallet() {
  const router = useRouter();
  const { connectedWallet, connectWallet } = useWallet();

  const [isOpen, setIsOpen] = useState(false);

  const handlePlayGame = async () => {
    await connectWallet();
    router.push('/game');
  };

  return (
    <>
      {connectedWallet ? (
        <Button
          onClick={handlePlayGame}
          className="bg-monad-yellow hover:bg-monad-light-yellow text-monad-primary mt-20"
        >
          Play Game
        </Button>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-monad-yellow hover:bg-monad-light-yellow text-monad-primary mt-20"
        >
          Connect wallet
        </Button>
      )}
      <WalletDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
