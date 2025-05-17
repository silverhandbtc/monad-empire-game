'use client';

import { Button } from '@/components/ui/button';
import { Music, Volume2, VolumeX } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AudioControlsProps {
  isMuted: boolean;
  isMusicMuted: boolean;
  toggleMute: () => void;
  toggleMusic: () => void;
}

export function AudioControls({
  isMuted,
  isMusicMuted,
  toggleMute,
  toggleMusic,
}: AudioControlsProps) {
  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className="bg-white/90 hover:bg-white border-amber-200 shadow-md"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-amber-600" />
              ) : (
                <Volume2 className="h-5 w-5 text-amber-600" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{isMuted ? 'Ativar sons' : 'Silenciar sons'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMusic}
              className={`bg-white/90 hover:bg-white border-amber-200 shadow-md ${
                isMusicMuted ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <Music className="h-5 w-5 text-amber-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{isMusicMuted ? 'Ativar música' : 'Silenciar música'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
