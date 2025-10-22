import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bonuses, userBonuses, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bonusCode } = body;

    // Validation: Required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!bonusCode) {
      return NextResponse.json(
        { error: 'Bonus code is required', code: 'MISSING_BONUS_CODE' },
        { status: 400 }
      );
    }

    // Validate userId is a valid integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { error: 'Invalid user ID', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userIdInt))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Trim and validate bonus code
    const trimmedCode = bonusCode.trim();
    if (!trimmedCode) {
      return NextResponse.json(
        { error: 'Bonus code cannot be empty', code: 'INVALID_BONUS_CODE' },
        { status: 400 }
      );
    }

    // Find bonus by code
    const bonus = await db
      .select()
      .from(bonuses)
      .where(eq(bonuses.code, trimmedCode))
      .limit(1);

    if (bonus.length === 0) {
      return NextResponse.json(
        { error: 'Invalid bonus code', code: 'INVALID_BONUS_CODE' },
        { status: 400 }
      );
    }

    const bonusData = bonus[0];

    // Check if bonus is active
    if (!bonusData.isActive) {
      return NextResponse.json(
        { error: 'Bonus is not active', code: 'BONUS_INACTIVE' },
        { status: 400 }
      );
    }

    // Check if bonus is within valid date range
    const now = new Date();
    const validFrom = new Date(bonusData.validFrom);
    const validUntil = new Date(bonusData.validUntil);

    if (now < validFrom) {
      return NextResponse.json(
        { error: 'Bonus is not yet valid', code: 'BONUS_NOT_STARTED' },
        { status: 400 }
      );
    }

    if (now > validUntil) {
      return NextResponse.json(
        { error: 'Bonus has expired', code: 'BONUS_EXPIRED' },
        { status: 400 }
      );
    }

    // Check if user has already claimed this bonus
    const existingClaim = await db
      .select()
      .from(userBonuses)
      .where(
        and(
          eq(userBonuses.userId, userIdInt),
          eq(userBonuses.bonusId, bonusData.id)
        )
      )
      .limit(1);

    if (existingClaim.length > 0) {
      return NextResponse.json(
        { error: 'Bonus already claimed', code: 'BONUS_ALREADY_CLAIMED' },
        { status: 400 }
      );
    }

    const currentTimestamp = new Date().toISOString();

    // Create user_bonuses record
    const userBonus = await db
      .insert(userBonuses)
      .values({
        userId: userIdInt,
        bonusId: bonusData.id,
        amount: bonusData.amount,
        wageredAmount: 0,
        status: 'active',
        claimedAt: currentTimestamp,
        expiresAt: bonusData.validUntil,
      })
      .returning();

    // Update user's bonusBalance if bonus has amount
    if (bonusData.amount > 0) {
      const currentUser = user[0];
      const newBonusBalance = currentUser.bonusBalance + bonusData.amount;

      await db
        .update(users)
        .set({
          bonusBalance: newBonusBalance,
          updatedAt: currentTimestamp,
        })
        .where(eq(users.id, userIdInt));
    }

    // Return the created user bonus with bonus details
    return NextResponse.json(
      {
        ...userBonus[0],
        bonus: {
          id: bonusData.id,
          name: bonusData.name,
          code: bonusData.code,
          type: bonusData.type,
          amount: bonusData.amount,
          percentage: bonusData.percentage,
          maxAmount: bonusData.maxAmount,
          wageringRequirement: bonusData.wageringRequirement,
          description: bonusData.description,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}