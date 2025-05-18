'use client';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface WalletOptionProps {
  wallet: {
    id: string;
    name: string;
    icon: string;
    type: string;
    description: string;
  };
  onClick: () => void;
  disabled?: boolean;
  isInstalled?: boolean;
}

export function WalletOption({
  wallet,
  onClick,
  disabled,
  isInstalled,
}: WalletOptionProps) {
  return (
    <Button
      variant="outline"
      className="justify-start h-auto p-4"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold">
          {wallet.icon}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center">
            <h3 className="font-medium">{wallet.name}</h3>
            {isInstalled && (
              <span className="ml-2 text-green-500 items-center text-xs hidden md:flex">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Installed
              </span>
            )}
            {isInstalled === false && (
              <span className="ml-2 text-amber-500 text-xs">Not installed</span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:flex">
            {wallet.description}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            Monad Testnet
          </span>
        </div>
      </div>
    </Button>
  );
}
