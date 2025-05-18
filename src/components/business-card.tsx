'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpCircle, Coins } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';

export function BusinessCard({
  business,
  money,
  calculateCost,
  calculateRevenue,
  onBuy,
  onUpgrade,
  onStart,
}) {
  const cost = calculateCost(business.baseCost, business.owned);
  const revenue = calculateRevenue(business.baseRevenue, business.level);
  const upgradeCost = business.baseCost * business.level * 10;
  const canBuy = money >= cost;
  const canUpgrade = money >= upgradeCost && business.owned > 0;
  const canStart = business.owned > 0 && !business.isRunning;

  return (
    <Card className="overflow-hidden bg-monad-600 border-monad-500 shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="flex-shrink-0 mr-4 text-4xl">
            <Avatar className="rounded-sm border border-gray-800 border-2 w-40 h-40">
              <AvatarImage src={`/${business.icon}`} alt="@shadcn" />
            </Avatar>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-gray-200">{business.name}</h3>
              <div className="text-sm text-amber-300">
                Level {business.level}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-300">Count: {business.owned}</div>
              <div className="flex items-center text-green-600">
                <Coins className="h-4 w-4 mr-1" />
                {formatCurrency(revenue * business.owned)}/cycle
              </div>
            </div>
            {business.owned > 0 && (
              <Progress
                value={business.progress}
                className="h-2 mt-2 bg-monad-background"
                indicatorClassName="bg-amber-300 transition-all duration-100 ease-linear"
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-3 bg-monad-600 border-t border-monad-500">
        <Button
          onClick={onBuy}
          disabled={!canBuy}
          variant={canBuy ? 'default' : 'outline'}
          className={`flex-1 mr-2 ${canBuy ? 'bg-amber-500 hover:bg-amber-600 text-monad-background' : 'text-monad-background border-amber-300'}`}
        >
          {business.owned === 0 ? 'Learn' : 'Expand'}: {formatCurrency(cost)}
        </Button>

        {business.owned > 0 && (
          <>
            <Button
              onClick={onUpgrade}
              disabled={!canUpgrade}
              className={`flex-1 mr-2 ${canUpgrade ? 'bg-amber-300 hover:bg-amber-400 text-amber-900' : 'text-gray-200 border-amber-300'}`}
            >
              <ArrowUpCircle className="h-4 w-4 mr-1" />
              {formatCurrency(upgradeCost)}
            </Button>

            <Button
              disabled={!canStart}
              onClick={onStart}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              {canStart ? 'Work' : 'In progress'}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
