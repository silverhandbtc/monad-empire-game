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

export function ManagerCard({
  manager,
  business,
  money,
  onBuy,
}: ManagerCardProps) {
  const canBuy =
    money >= manager.cost && !manager.purchased && business.owned > 0;

  return (
    <Card className="overflow-hidden bg-white border-amber-200 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4 bg-amber-100 p-3 rounded-full">
            <User className="h-8 w-8 text-amber-600" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-amber-800">{manager.name}</h3>
              {manager.purchased && (
                <BadgeCheck className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-amber-700">Manages: {business.name}</p>
            <p className="text-sm mt-1 text-amber-700">
              {manager.purchased
                ? 'Produces automatically without your intervention'
                : `Cost: ${formatCurrency(manager.cost)}`}
            </p>
          </div>
          <Avatar className="rounded-sm border border-gray-800 border-2">
            <AvatarImage src={`/${business.icon}`} alt="@shadcn" />
          </Avatar>
        </div>
      </CardContent>
      <CardFooter className="p-3 bg-amber-50 border-t border-amber-200">
        <Button
          onClick={onBuy}
          disabled={!canBuy || manager.purchased}
          variant={canBuy && !manager.purchased ? 'default' : 'outline'}
          className={`w-full ${
            canBuy && !manager.purchased
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : manager.purchased
                ? 'bg-green-100 text-green-700 border-green-300'
                : 'text-amber-800 border-amber-300'
          }`}
        >
          {manager.purchased
            ? 'Hired'
            : business.owned === 0
              ? 'Buy the business first'
              : `Hire for ${formatCurrency(manager.cost)}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
