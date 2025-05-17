'use client';

import { useWallet } from '@/hooks/use-wallet';
import { formatAddress } from '@/utils/formatters/format-address';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  return (
    <header className="flex items-center p-4 bg-monad-background text-white flex-col md:flex-row">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-xl font-bold">Monad Empire</h1>
        </Link>
      </div>
      <nav className="flex space-x-4 md:ml-auto md:mr-8">
        <Link href="/" className="text-white hover:text-gray-300">
          Game
        </Link>
        <Link href="/leaderboard" className="text-white hover:text-gray-300">
          Leaderboard
        </Link>
      </nav>
      <WalletToggle />
    </header>
  );
}

export function WalletToggle() {
  const { disconnectWallet, connectedWallet, connectWallet } = useWallet();
  return (
    <>
      {!connectedWallet && (
        <Button onClick={() => connectWallet()}>
          <span className="text-sm">Connect</span>
        </Button>
      )}

      {connectedWallet && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>{formatAddress(connectedWallet)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => disconnectWallet()}
            >
              <LogOut />
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
