import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { games } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// ✅ Correct type for Next.js 15 App Router
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ Now compatible with new App Router spec

  try {
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Valid game ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const gameId = Number(id);

    const game = await db
      .select()
      .from(games)
      .where(and(eq(games.id, gameId), eq(games.isActive, true)))
      .limit(1);

    if (game.length === 0) {
      return NextResponse.json(
        { error: 'Game not found or not active', code: 'GAME_NOT_FOUND' },
        { status: 404 }
      );
    }

    const gameRecord = game[0];

    await db
      .update(games)
      .set({
        playCount: gameRecord.playCount + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(games.id, gameId));

    return NextResponse.json({
      ...gameRecord,
      playCount: gameRecord.playCount + 1,
    });
  } catch (error) {
    console.error('GET game error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
