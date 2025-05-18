'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, TrendingUp, Trophy, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.push('/game');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-monad-background text-amber-300 p-4 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-monad-background text-amber-900 p-4">
      <header className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <img src="/logo.png" width={250} alt="Logo" className="mb-4" />
        <Button
          onClick={handleBack}
          className="bg-amber-500 hover:bg-amber-600 text-monad-background flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Game
        </Button>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-monad-600 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Trophy className="h-10 w-10 text-gray-100" />
            <h1 className="text-3xl font-bold text-gray-100">Leaderboard</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-monad-background rounded-full p-4 mb-4">
              <TrendingUp className="h-16 w-16 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">
              Coming Soon!
            </h2>
            <p className="text-gray-100 max-w-md mb-6">
              We're working hard to implement the global leaderboard feature.
              Soon you'll be able to compete with players from around the world!
            </p>
            <div className="bg-monad-background rounded-lg p-4 text-left w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-100 mb-2 flex items-center">
                <Coins className="h-5 w-5 mr-2 text-gray-100" />
                Planned Features:
              </h3>
              <ul className="text-gray-100 space-y-2">
                <li className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Global ranking based on total earnings</div>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Weekly and monthly competitions</div>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Special rewards for top players</div>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Friend challenges and competitions</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-8 text-center text-gray-100 text-sm">
        <p>Stay tuned for updates! The leaderboard will be available soon.</p>
      </footer>
    </div>
  );
}
