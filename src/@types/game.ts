export interface Business {
  id: number;
  name: string;
  baseCost: number;
  baseRevenue: number;
  baseTime: number;
  owned: number;
  level: number;
  manager: boolean;
  progress: number;
  isRunning: boolean;
  icon: string;
}

export interface Manager {
  id: number;
  businessId: number;
  name: string;
  cost: number;
  purchased: boolean;
}

export interface PlayerLevel {
  level: number;
  progress: number;
  nextLevelAt: number;
}

export interface SaveGamePayload {
  walletAddress: string;
  gameData: GameData;
}

export interface GameData {
  money: number;
  totalEarned: number;
  playerLevel: PlayerLevel;
  businesses: Business[];
  managers: Manager[];
}
