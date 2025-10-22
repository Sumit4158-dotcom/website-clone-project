import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bets, games } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Validate userId is provided
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        { 
          error: 'Valid userId is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Parse pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Parse filter parameters
    const gameId = searchParams.get('gameId');
    const status = searchParams.get('status');

    // Parse sorting parameters
    const sort = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';

    // Build base query with join to games table
    let query = db
      .select({
        id: bets.id,
        userId: bets.userId,
        gameId: bets.gameId,
        gameName: games.name,
        betAmount: bets.betAmount,
        winAmount: bets.winAmount,
        multiplier: bets.multiplier,
        status: bets.status,
        betData: bets.betData,
        createdAt: bets.createdAt,
        settledAt: bets.settledAt,
      })
      .from(bets)
      .leftJoin(games, eq(bets.gameId, games.id));

    // Build where conditions
    const conditions = [eq(bets.userId, parseInt(userId))];

    // Add gameId filter if provided
    if (gameId && !isNaN(parseInt(gameId))) {
      conditions.push(eq(bets.gameId, parseInt(gameId)));
    }

    // Add status filter if provided
    if (status) {
      const validStatuses = ['pending', 'win', 'loss'];
      if (validStatuses.includes(status.toLowerCase())) {
        conditions.push(eq(bets.status, status.toLowerCase()));
      }
    }

    // Apply where conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const sortColumn = sort === 'createdAt' ? bets.createdAt : bets.createdAt;
    if (order.toLowerCase() === 'asc') {
      query = query.orderBy(asc(sortColumn)) as any;
    } else {
      query = query.orderBy(desc(sortColumn)) as any;
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET betting history error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}