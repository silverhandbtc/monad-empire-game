import type { PlayerLevel } from '@/@types/game';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/utils';
import { Award } from 'lucide-react';

interface LevelInfoProps {
  playerLevel: PlayerLevel;
  totalEarned: number;
}

export function LevelInfo({ playerLevel, totalEarned }: LevelInfoProps) {
  const level = playerLevel?.level || 1;
  const progress = playerLevel?.progress || 0;
  const nextLevelAt = playerLevel?.nextLevelAt || 100;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 text-lg font-medium text-amber-300">
        <Award className="h-5 w-5 text-amber-300" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">Level {level}</span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p>Total earned: {formatNumber(totalEarned || 0)}</p>
                <p>Next level at: {formatNumber(nextLevelAt)}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="w-full max-w-xs mt-1">
        <Progress
          value={progress}
          className="h-2 bg-amber-100"
          indicatorClassName="bg-amber-500 transition-all duration-300 ease-out"
        />
        <div className="flex justify-between text-xs text-amber-700 mt-1">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
