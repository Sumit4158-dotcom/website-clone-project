import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userBonuses, bonuses } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const status = searchParams.get('status');
    const sortOrder = searchParams.get('order')?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'userId is required',
          code: 'MISSING_USER_ID'
        },
        { status: 400 }
      );
    }

    // Validate userId is a valid integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { 
          error: 'Invalid userId format',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    // Build query conditions
    const conditions = [eq(userBonuses.userId, userIdInt)];

    // Add status filter if provided
    if (status) {
      const validStatuses = ['active', 'completed', 'expired', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { 
            error: 'Invalid status. Must be one of: active, completed, expired, cancelled',
            code: 'INVALID_STATUS'
          },
          { status: 400 }
        );
      }
      conditions.push(eq(userBonuses.status, status));
    }

    // Execute query with join to get bonus details
    const results = await db
      .select({
        id: userBonuses.id,
        userId: userBonuses.userId,
        bonusId: userBonuses.bonusId,
        amount: userBonuses.amount,
        wageredAmount: userBonuses.wageredAmount,
        status: userBonuses.status,
        claimedAt: userBonuses.claimedAt,
        expiresAt: userBonuses.expiresAt,
        completedAt: userBonuses.completedAt,
        bonus: {
          id: bonuses.id,
          name: bonuses.name,
          code: bonuses.code,
          type: bonuses.type,
          percentage: bonuses.percentage,
          maxAmount: bonuses.maxAmount,
          wageringRequirement: bonuses.wageringRequirement,
          description: bonuses.description,
        }
      })
      .from(userBonuses)
      .leftJoin(bonuses, eq(userBonuses.bonusId, bonuses.id))
      .where(and(...conditions))
      .orderBy(sortOrder === 'asc' ? asc(userBonuses.claimedAt) : desc(userBonuses.claimedAt))
      .limit(limit)
      .offset(offset);

    // Return empty array if no results found
    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}