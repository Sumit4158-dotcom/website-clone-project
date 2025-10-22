import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bets, users, games } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameId, betAmount, winAmount, multiplier, status, betData } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!gameId) {
      return NextResponse.json({ 
        error: "gameId is required",
        code: "MISSING_GAME_ID" 
      }, { status: 400 });
    }

    if (!betAmount) {
      return NextResponse.json({ 
        error: "betAmount is required",
        code: "MISSING_BET_AMOUNT" 
      }, { status: 400 });
    }

    // Validate betAmount is a positive number
    const parsedBetAmount = parseFloat(betAmount);
    if (isNaN(parsedBetAmount) || parsedBetAmount <= 0) {
      return NextResponse.json({ 
        error: "betAmount must be a positive number",
        code: "INVALID_BET_AMOUNT" 
      }, { status: 400 });
    }

    // Validate userId is a valid integer
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ 
        error: "userId must be a valid integer",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    // Validate gameId is a valid integer
    const parsedGameId = parseInt(gameId);
    if (isNaN(parsedGameId)) {
      return NextResponse.json({ 
        error: "gameId must be a valid integer",
        code: "INVALID_GAME_ID" 
      }, { status: 400 });
    }

    // Check if user exists
    const user = await db.select()
      .from(users)
      .where(eq(users.id, parsedUserId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Check if game exists
    const game = await db.select()
      .from(games)
      .where(eq(games.id, parsedGameId))
      .limit(1);

    if (game.length === 0) {
      return NextResponse.json({ 
        error: "Game not found",
        code: "GAME_NOT_FOUND" 
      }, { status: 404 });
    }

    const gameData = game[0];

    // Validate bet amount is within game's min and max bet range
    if (parsedBetAmount < gameData.minBet) {
      return NextResponse.json({ 
        error: `Bet amount must be at least ${gameData.minBet}`,
        code: "BET_AMOUNT_TOO_LOW" 
      }, { status: 400 });
    }

    if (parsedBetAmount > gameData.maxBet) {
      return NextResponse.json({ 
        error: `Bet amount cannot exceed ${gameData.maxBet}`,
        code: "BET_AMOUNT_TOO_HIGH" 
      }, { status: 400 });
    }

    const userData = user[0];

    // Check if user has sufficient balance
    if (userData.balance < parsedBetAmount) {
      return NextResponse.json({ 
        error: "Insufficient balance",
        code: "INSUFFICIENT_BALANCE" 
      }, { status: 400 });
    }

    // Validate optional fields
    const parsedWinAmount = winAmount !== undefined ? parseFloat(winAmount) : 0;
    if (isNaN(parsedWinAmount) || parsedWinAmount < 0) {
      return NextResponse.json({ 
        error: "winAmount must be a non-negative number",
        code: "INVALID_WIN_AMOUNT" 
      }, { status: 400 });
    }

    const parsedMultiplier = multiplier !== undefined ? parseFloat(multiplier) : 0;
    if (isNaN(parsedMultiplier) || parsedMultiplier < 0) {
      return NextResponse.json({ 
        error: "multiplier must be a non-negative number",
        code: "INVALID_MULTIPLIER" 
      }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['pending', 'win', 'loss'];
    const betStatus = status || 'pending';
    if (!validStatuses.includes(betStatus)) {
      return NextResponse.json({ 
        error: "status must be one of: pending, win, loss",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate betData is valid JSON string if provided
    let parsedBetData = betData;
    if (betData) {
      try {
        if (typeof betData === 'object') {
          parsedBetData = JSON.stringify(betData);
        } else if (typeof betData === 'string') {
          JSON.parse(betData);
          parsedBetData = betData;
        }
      } catch (error) {
        return NextResponse.json({ 
          error: "betData must be a valid JSON string",
          code: "INVALID_BET_DATA" 
        }, { status: 400 });
      }
    }

    // Create the bet
    const newBet = await db.insert(bets)
      .values({
        userId: parsedUserId,
        gameId: parsedGameId,
        betAmount: parsedBetAmount,
        winAmount: parsedWinAmount,
        multiplier: parsedMultiplier,
        status: betStatus,
        betData: parsedBetData || null,
        createdAt: new Date().toISOString(),
        settledAt: null,
      })
      .returning();

    return NextResponse.json(newBet[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}