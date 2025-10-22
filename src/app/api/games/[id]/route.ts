import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { games } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid game ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const gameId = parseInt(id);

    // Fetch game with active filter
    const game = await db.select()
      .from(games)
      .where(and(
        eq(games.id, gameId),
        eq(games.isActive, true)
      ))
      .limit(1);

    // Check if game exists and is active
    if (game.length === 0) {
      return NextResponse.json(
        { 
          error: 'Game not found or not active',
          code: 'GAME_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const gameRecord = game[0];

    // Increment play count
    await db.update(games)
      .set({
        playCount: gameRecord.playCount + 1,
        updatedAt: new Date().toISOString()
      })
      .where(eq(games.id, gameId));

    // Return game with incremented play count
    return NextResponse.json({
      ...gameRecord,
      playCount: gameRecord.playCount + 1
    });

  } catch (error) {
    console.error('GET game error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message
      },
      { status: 500 }
    );
  }
}