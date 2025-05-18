'use client';

import type { Business, GameData, Manager, PlayerLevel } from '@/@types/game';
import { AudioControls } from '@/components/audio-controls';
import { BusinessCard } from '@/components/business-card';
import { LevelInfo } from '@/components/level-info';
import { LevelUpModal } from '@/components/level-up-modal';
import { ManagerCard } from '@/components/manager-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSound } from '@/hooks/use-sound';
import { useWallet } from '@/hooks/use-wallet';
import { formatCurrency } from '@/lib/utils';
import { saveGameData } from '@/services/game';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Coins, TrendingUp, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function Game() {
  const { isLoading: isLoadingGameData, isFetching } = useQuery({
    queryKey: ['GAME_DATA'],
    queryFn: async () => {
      if (!connectedWallet) {
        router.push('/');
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/game-data?walletAddress=${connectedWallet}`,
        );

        if (!response.ok) {
          throw new Error('Failed to load game data');
        }

        const gameData: GameData = await response.json();

        setMoney(gameData.money);
        gameData.businesses.sort((a, b) => a.id - b.id)
        setBusinesses(gameData.businesses);
        setManagers(gameData.managers);
        setTotalEarned(gameData.totalEarned || 0);
        setPlayerLevel(
          gameData.playerLevel || {
            level: 1,
            progress: 0,
            nextLevelAt: 100,
          },
        );
        prevLevelRef.current = gameData.playerLevel.level || 1;
      } catch (error) {
        console.error('Error loading game data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { mutateAsync: saveGame } = useMutation({
    mutationFn: () =>
      saveGameData(String(connectedWallet), {
        money,
        businesses,
        managers,
        totalEarned,
        playerLevel,
      }),
  });

  const { connectedWallet } = useWallet();
  const router = useRouter();
  const [money, setMoney] = useState<number>(50);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [playerLevel, setPlayerLevel] = useState<PlayerLevel>({
    level: 1,
    progress: 0,
    nextLevelAt: 100,
  });
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  const processingPurchase = useRef<boolean>(false);

  const { playSound, toggleMute, toggleMusic, isMuted, isMusicMuted } =
    useSound();
  const prevLevelRef = useRef<number>(playerLevel.level);

  const isSaving = useRef<boolean>(false);

  const calculateCost = useCallback(
    (baseCost: number, owned: number): number => {
      return Math.floor(baseCost * Math.pow(1.07, owned));
    },
    [],
  );

  const calculateRevenue = useCallback(
    (baseRevenue: number, level: number): number => {
      return baseRevenue * level;
    },
    [],
  );

  const calculateLevel = useCallback((totalEarned: number): PlayerLevel => {
    let level = 1;
    let requiredForNextLevel = 100;
    let requiredForCurrentLevel = 0;

    while (totalEarned >= requiredForNextLevel) {
      level++;
      requiredForCurrentLevel = requiredForNextLevel;
      requiredForNextLevel *= 2;
    }

    const remainingForLevel = totalEarned - requiredForCurrentLevel;
    const requiredForLevelUp = requiredForNextLevel - requiredForCurrentLevel;
    const progress = (remainingForLevel / requiredForLevelUp) * 100;

    return { level, progress, nextLevelAt: requiredForNextLevel };
  }, []);

  useMemo(() => {
    if (prevLevelRef.current < playerLevel.level) {
      playSound('levelUp');
      setIsGamePaused(true);
      setShowLevelUpModal(true);
      saveGame();
    }
    prevLevelRef.current = playerLevel.level;
  }, [playerLevel.level, playSound, saveGame]);

  const handleCloseLevelUpModal = useCallback(() => {
    setShowLevelUpModal(false);
    setIsGamePaused(false);
  }, []);

  const buyBusiness = useCallback(
    (id: number) => {
      if (isGamePaused || processingPurchase.current) return;

      processingPurchase.current = true;

      setBusinesses((prevBusinesses) => {
        const business = prevBusinesses.find((b) => b.id === id);
        if (!business) {
          processingPurchase.current = false;
          return prevBusinesses;
        }

        const cost = calculateCost(business.baseCost, business.owned);

        if (money >= cost) {
          setMoney((prevMoney) => prevMoney - cost);
          playSound('buy');

          const updatedBusinesses = prevBusinesses.map((b) => {
            if (b.id === id) {
              return {
                ...b,
                owned: b.owned + 1,
              };
            }
            return b;
          });

          processingPurchase.current = false;
          return updatedBusinesses;
        }

        processingPurchase.current = false;
        return prevBusinesses;
      });
    },
    [isGamePaused, money, calculateCost, playSound],
  );

  const upgradeBusiness = useCallback(
    (id: number) => {
      if (isGamePaused || processingPurchase.current) return;

      processingPurchase.current = true;

      setBusinesses((prevBusinesses) => {
        const business = prevBusinesses.find((b) => b.id === id);
        if (!business || business.owned <= 0) {
          processingPurchase.current = false;
          return prevBusinesses;
        }

        const upgradeCost = business.baseCost * business.level * 10;

        if (money >= upgradeCost) {
          setMoney((prevMoney) => prevMoney - upgradeCost);
          playSound('upgrade');

          const updatedBusinesses = prevBusinesses.map((b) => {
            if (b.id === id) {
              return {
                ...b,
                level: b.level + 1,
              };
            }
            return b;
          });

          processingPurchase.current = false;
          return updatedBusinesses;
        }

        processingPurchase.current = false;
        return prevBusinesses;
      });
    },
    [isGamePaused, money, playSound],
  );

  const buyManager = useCallback(
    (managerId: number) => {
      if (isGamePaused || processingPurchase.current) return;

      processingPurchase.current = true;

      const manager = managers.find((m) => m.id === managerId);
      if (!manager || manager.purchased) {
        processingPurchase.current = false;
        return;
      }

      if (money >= manager.cost) {
        setMoney((prevMoney) => prevMoney - manager.cost);
        playSound('manager');

        setManagers((prevManagers) => {
          return prevManagers.map((m) => {
            if (m.id === managerId) {
              return { ...m, purchased: true };
            }
            return m;
          });
        });

        setBusinesses((prevBusinesses) => {
          return prevBusinesses.map((business) => {
            if (business.id === manager.businessId) {
              return { ...business, manager: true };
            }
            return business;
          });
        });
      }

      processingPurchase.current = false;
    },
    [isGamePaused, money, managers, playSound],
  );

  const startProduction = useCallback(
    (id: number) => {
      if (isGamePaused) return;

      setBusinesses((prevBusinesses) => {
        return prevBusinesses.map((business) => {
          if (business.id === id && business.owned > 0 && !business.isRunning) {
            playSound('start');
            return {
              ...business,
              isRunning: true,
              progress: 0,
            };
          }
          return business;
        });
      });
    },
    [isGamePaused, playSound],
  );

  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      if (isGamePaused) return;

      setBusinesses((prevBusinesses) => {
        let moneyToAdd = 0;
        let completedProduction = false;

        const updatedBusinesses = prevBusinesses.map((business) => {
          if (business.owned > 0) {
            if (business.manager && !business.isRunning) {
              business = { ...business, isRunning: true, progress: 0 };
            }

            if (business.isRunning) {
              const newProgress =
                business.progress + (100 / (business.baseTime * 1000)) * 16;

              if (newProgress >= 100) {
                const revenue =
                  calculateRevenue(business.baseRevenue, business.level) *
                  business.owned;
                moneyToAdd += revenue;
                completedProduction = true;

                return {
                  ...business,
                  progress: 0,
                  isRunning: business.manager,
                };
              }

              return {
                ...business,
                progress: newProgress,
              };
            }
          }
          return business;
        });

        if (moneyToAdd > 0) {
          setMoney((prevMoney) => prevMoney + moneyToAdd);
          if (completedProduction) {
            playSound('complete');
          }

          setTotalEarned((prev) => {
            const newTotal = prev + moneyToAdd;
            const newLevel = calculateLevel(newTotal);
            setPlayerLevel(newLevel);
            return newTotal;
          });
        }

        return updatedBusinesses;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [playSound, isGamePaused, isLoading, calculateRevenue, calculateLevel]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-monad-background text-amber-300 p-4 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-monad-background text-amber-300 p-4">
      <header className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <img src="/logo.png" width={150} alt="Logo" className="mb-4" />
        <div>
          <div className="flex justify-center items-center gap-2 text-4xl font-bold mb-2">
            <Coins className="h-8 w-8 text-amber-300" />
            <span>{formatCurrency(money)}</span>
          </div>
          <LevelInfo playerLevel={playerLevel} totalEarned={totalEarned} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <Tabs defaultValue="businesses">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-monad-600">
            <TabsTrigger
              value="businesses"
              className="text-lg data-[state=active]:text-amber-300 data-[state=active]:bg-monad-500"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Jobs
            </TabsTrigger>
            <TabsTrigger
              value="managers"
              className="text-lg data-[state=active]:text-amber-300 data-[state=active]:bg-monad-500"
            >
              <Users className="mr-2 h-5 w-5" />
              Managers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="businesses" className="space-y-4">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                money={money}
                calculateCost={calculateCost}
                calculateRevenue={calculateRevenue}
                onBuy={() => buyBusiness(business.id)}
                onUpgrade={() => upgradeBusiness(business.id)}
                onStart={() => startProduction(business.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="managers" className="space-y-4">
            {managers.map((manager) => {
              const business = businesses.find(
                (b) => b.id === manager.businessId,
              );
              return (
                <ManagerCard
                  key={manager.id}
                  manager={manager}
                  business={business!}
                  money={money}
                  onBuy={() => buyManager(manager.id)}
                />
              );
            })}
          </TabsContent>
        </Tabs>
      </main>

      <AudioControls
        isMuted={isMuted}
        isMusicMuted={isMusicMuted}
        toggleMute={toggleMute}
        toggleMusic={toggleMusic}
      />

      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={handleCloseLevelUpModal}
        level={playerLevel.level}
      />
    </div>
  );
}
