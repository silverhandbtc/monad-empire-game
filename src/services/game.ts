import type { GameData } from '@/@types/game';

export async function saveGameData(walletAddress: string, gameData: GameData) {
  const data = {
    walletAddress,
    gameData,
  };

  const response = await fetch('/api/game-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
