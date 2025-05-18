'use client';

import type { Business, Manager } from '@/@types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { BadgeCheck, User } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';

interface ManagerCardProps {
  manager: Manager;
  business: Business;
  money: number;
  onBuy: () => void;
}

const MANAGER_ASSETS = {
  1: '/john.jpg',
  2: '/mary.jpg',
  3: '/wolf.jpg',
  4: '/mox.jpg',
}

export function ManagerCard({
  manager,
  business,
  money,
  onBuy,
}: ManagerCardProps) {
  const canBuy =
    money >= manager.cost && !manager.purchased && business.owned > 0;

  return (
    <Card className="overflow-hidden bg-monad-600 border-monad-500 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center flex-col gap-4 md:flex-row">
          <Avatar className="rounded-lg border-amber-300 border-2 w-40 h-40 mr-4">
            <AvatarImage src={MANAGER_ASSETS[manager.id]} alt={manager.name} />
          </Avatar>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-gray-100">{manager.name}</h3>
              {manager.purchased && (
                <BadgeCheck className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-gray-100">Manages: {business.name}</p>
            <p className="text-sm mt-1 text-gray-100">
              {manager.purchased
                ? 'Produces automatically without your intervention'
                : `Cost: ${formatCurrency(manager.cost)}`}
            </p>
          </div>
          <Avatar className="rounded-sm border-gray-800 border-2 hidden md:block">
            <AvatarImage src={`/${business.icon}`} alt="@shadcn" />
          </Avatar>
        </div>
      </CardContent>
      <CardFooter className="p-3 bg-monad-600 border-t border-monad-500">
        <Button
          onClick={onBuy}
          disabled={!canBuy || manager.purchased}
          variant={canBuy && !manager.purchased ? 'default' : 'outline'}
          className={`w-full ${canBuy && !manager.purchased
            ? 'bg-amber-500 hover:bg-amber-600 text-white'
            : manager.purchased
              ? 'bg-green-100 text-green-700 border-green-300'
              : 'text-amber-800 border-amber-300'
            }`}
        >
          {manager.purchased
            ? 'Hired'
            : business.owned === 0
              ? 'Learn this first'
              : `Hire for ${formatCurrency(manager.cost)}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
