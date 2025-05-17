import type { GameData } from '@/@types/game';
import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 },
      );
    }

    let user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
        gameData: {
          include: {
            businesses: true,
            managers: true,
          },
        },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: walletAddress.toLowerCase(),
          gameData: {
            create: {
              money: 50,
              totalEarned: 0,
              playerLevel: {
                level: 1,
                progress: 0,
                nextLevelAt: 100,
              },
              businesses: {
                create: [
                  {
                    businessId: 1,
                    name: 'Micro-Trading on Kuru',
                    baseCost: 10,
                    baseRevenue: 1,
                    baseTime: 10,
                    icon: 'kuru.jpg',
                  },
                  {
                    businessId: 2,
                    name: 'Basic NFT Minting',
                    baseCost: 60,
                    baseRevenue: 8,
                    baseTime: 30,
                    icon: 'magiceden.png',
                  },
                ],
              },
              managers: {
                create: [
                  {
                    managerId: 1,
                    businessId: 1,
                    name: 'John',
                    cost: 1000,
                  },
                  {
                    managerId: 2,
                    businessId: 2,
                    name: 'Mary',
                    cost: 15000,
                  },
                ],
              },
            },
          },
        },
        include: {
          gameData: {
            include: {
              businesses: true,
              managers: true,
            },
          },
        },
      });
    }

    const gameData: GameData = {
      money: user.gameData!.money,
      totalEarned: user.gameData!.totalEarned,
      playerLevel: user.gameData!.playerLevel as any, // Prisma JSON type
      businesses: user.gameData!.businesses.map((b) => ({
        id: b.businessId,
        name: b.name,
        baseCost: b.baseCost,
        baseRevenue: b.baseRevenue,
        baseTime: b.baseTime,
        owned: b.owned,
        level: b.level,
        manager: b.manager,
        progress: b.progress,
        isRunning: b.isRunning,
        icon: b.icon,
      })),
      managers: user.gameData!.managers.map((m) => ({
        id: m.managerId,
        businessId: m.businessId,
        name: m.name,
        cost: m.cost,
        purchased: m.purchased,
      })),
    };

    return NextResponse.json(gameData);
  } catch (error) {
    console.error('Error loading game data:', error);
    return NextResponse.json(
      { error: 'Failed to load game data' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      gameData,
    }: { walletAddress: string; gameData: GameData } = body;

    if (!walletAddress || !gameData) {
      return NextResponse.json(
        { error: 'Wallet address and game data are required' },
        { status: 400 },
      );
    }

    let user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: { gameData: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: walletAddress.toLowerCase(),
        },
      });
    }

    const gameDataRecord = await prisma.gameData.upsert({
      where: { userId: user.id },
      update: {
        money: gameData.money,
        totalEarned: gameData.totalEarned,
        playerLevel: gameData.playerLevel,
      },
      create: {
        userId: user.id,
        money: gameData.money,
        totalEarned: gameData.totalEarned,
        playerLevel: gameData.playerLevel,
      },
    });

    await prisma.business.deleteMany({
      where: { gameDataId: gameDataRecord.id },
    });

    await prisma.manager.deleteMany({
      where: { gameDataId: gameDataRecord.id },
    });

    await Promise.all(
      gameData.businesses.map(async (business) => {
        await prisma.business.create({
          data: {
            gameDataId: gameDataRecord.id,
            businessId: business.id,
            name: business.name,
            baseCost: business.baseCost,
            baseRevenue: business.baseRevenue,
            baseTime: business.baseTime,
            owned: business.owned,
            level: business.level,
            manager: business.manager,
            progress: business.progress,
            isRunning: business.isRunning,
            icon: business.icon,
          },
        });
      }),
    );

    await Promise.all(
      gameData.managers.map(async (manager) => {
        await prisma.manager.create({
          data: {
            gameDataId: gameDataRecord.id,
            managerId: manager.id,
            businessId: manager.businessId,
            name: manager.name,
            cost: manager.cost,
            purchased: manager.purchased,
          },
        });
      }),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving game data:', error);
    return NextResponse.json(
      { error: 'Failed to save game data' },
      { status: 500 },
    );
  }
}
