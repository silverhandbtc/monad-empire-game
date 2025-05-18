'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import env from '@/config/env';
import { useWallet } from '@/hooks/use-wallet';
import {
  Award,
  Check,
  Copy,
  CopyCheck,
  ExternalLink,
  Loader2,
  PartyPopper,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Confetti from 'react-confetti';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
}

export function LevelUpModal({ isOpen, onClose, level }: LevelUpModalProps) {
  const { connectedWallet } = useWallet();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const explorerUrl =
    env.NEXT_PUBLIC_MONAD_EXPLORER_URL || 'https://explorer.monad.xyz';

  const copyTransactionHash = useCallback(() => {
    if (transactionHash) {
      navigator.clipboard
        .writeText(transactionHash)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => console.error('Error copying: ', err));
    }
  }, [transactionHash]);

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (isOpen) {
      setTransactionStatus('idle');
      setTransactionHash(null);
      setError(null);
      setShowConfetti(true);

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  const sendTestTransaction = useCallback(async () => {
    if (isTransactionLoading || !connectedWallet) return;

    try {
      setIsTransactionLoading(true);
      setTransactionStatus('pending');
      setTransactionHash(null);
      setError(null);

      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not found!');
      }

      const transactionParameters = {
        to: connectedWallet, // Send to own address
        from: connectedWallet,
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
  }, [connectedWallet, isTransactionLoading]);

  // Handle close with transaction check
  const handleContinue = () => {
    if (transactionStatus === 'success') {
      onClose();
    } else {
      sendTestTransaction();
    }
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <Dialog
        open={isOpen}
        onOpenChange={(open) =>
          open && !open && transactionStatus === 'success' && onClose()
        }
      >
        <DialogContent className="bg-monad-background border-monad-500 text-amber-900 max-w-md mx-auto">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-monad-500 p-4 rounded-full">
                <Award className="h-12 w-12 text-monad-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-gray-100 flex items-center justify-center gap-2">
              <PartyPopper className="h-6 w-6 text-amber-00" />
              Level {level} Reached!
              <PartyPopper className="h-6 w-6 text-gray-100" />
            </DialogTitle>
            <DialogDescription className="text-center text-gray-100 mt-2">
              Congratulations! You've reached level {level}. Keep expanding your
              business empire!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-monad-600 rounded-lg p-4 text-center">
              <p className="text-gray-100 font-medium">
                Tips for the next level:
              </p>
              <ul className="text-gray-100 text-sm mt-2 space-y-1 text-left list-disc list-inside">
                <li>Hire managers to automate your jobs</li>
                <li>Upgrade your jobs to increase revenue</li>
                <li>Diversify by investing in different types of jobs</li>
              </ul>
            </div>

            <div className="mt-4 bg-monad-600 rounded-lg p-4">
              <p className="text-gray-100 font-medium text-center mb-3">
                Confirm your level with a transaction:
              </p>

              <div className="flex flex-col items-center">
                {transactionStatus === 'idle' && (
                  <div className="text-gray-100 text-sm text-center mb-2">
                    Click the button below to make a confirmation transaction.
                  </div>
                )}

                {transactionStatus === 'pending' && (
                  <div className="flex items-center justify-center text-amber-700 gap-2 mb-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Waiting for confirmation...</span>
                  </div>
                )}

                {transactionStatus === 'success' && (
                  <div className="bg-green-100 rounded-lg p-3 mb-2 w-full">
                    <div className="flex items-center justify-center text-green-600 gap-2">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">
                        Transaction confirmed!
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-100 rounded-lg p-3 text-red-600 text-center text-sm mb-2 w-full">
                    {error}
                    <div className="mt-1 text-xs">
                      Try again by clicking the button below.
                    </div>
                  </div>
                )}

                {transactionHash && (
                  <div className="flex flex-col items-center justify-center mt-2 w-full">
                    <div className="flex items-center text-xs text-amber-700 mb-2">
                      <span className="mr-1">Hash:</span>
                      <span className="font-mono">
                        {transactionHash.substring(0, 6)}...
                        {transactionHash.substring(transactionHash.length - 6)}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={copyTransactionHash}
                              className="ml-2 p-1 rounded-full hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                              aria-label="Copy transaction hash"
                            >
                              {isCopied ? (
                                <CopyCheck className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-amber-600" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isCopied ? 'Copied!' : 'Copy hash'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <a
                      href={`${explorerUrl}/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs bg-amber-200 hover:bg-amber-300 text-amber-800 px-3 py-1 rounded-full transition-colors"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View on Blockchain Explorer
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleContinue}
              disabled={isTransactionLoading}
              className={`w-full ${transactionStatus === 'success'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-amber-500 hover:bg-amber-600'
                } text-monad-background`}
            >
              {isTransactionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : transactionStatus === 'success' ? (
                'Continue'
              ) : (
                'Make Confirmation Transaction'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
