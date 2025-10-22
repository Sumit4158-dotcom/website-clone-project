import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bonuses } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

const VALID_BONUS_TYPES = ['welcome', 'deposit', 'cashback', 'free_spins', 'referral'];

function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function isValidBonusType(type: string): boolean {
  return VALID_BONUS_TYPES.includes(type);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single bonus by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const bonus = await db
        .select()
        .from(bonuses)
        .where(eq(bonuses.id, parseInt(id)))
        .limit(1);

      if (bonus.length === 0) {
        return NextResponse.json(
          { error: 'Bonus not found', code: 'BONUS_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(bonus[0], { status: 200 });
    }

    // List bonuses with pagination, search, filtering, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const isActiveParam = searchParams.get('isActive');
    const sort = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';

    let query = db.select().from(bonuses);

    // Build conditions array
    const conditions = [];

    // Search by name or code
    if (search) {
      conditions.push(
        or(
          like(bonuses.name, `%${search}%`),
          like(bonuses.code, `%${search}%`)
        )
      );
    }

    // Filter by type
    if (type) {
      if (!isValidBonusType(type)) {
        return NextResponse.json(
          { error: 'Invalid bonus type', code: 'INVALID_TYPE' },
          { status: 400 }
        );
      }
      conditions.push(eq(bonuses.type, type));
    }

    // Filter by isActive
    if (isActiveParam !== null) {
      const isActive = isActiveParam === 'true';
      conditions.push(eq(bonuses.isActive, isActive));
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    if (sort === 'createdAt') {
      query = order === 'asc' 
        ? query.orderBy(asc(bonuses.createdAt))
        : query.orderBy(desc(bonuses.createdAt));
    } else if (sort === 'amount') {
      query = order === 'asc'
        ? query.orderBy(asc(bonuses.amount))
        : query.orderBy(desc(bonuses.amount));
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      code,
      type,
      validFrom,
      validUntil,
      amount = 0,
      percentage = 0,
      maxAmount = 0,
      wageringRequirement = 0,
      isActive = true,
      description,
    } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string' || code.trim() === '') {
      return NextResponse.json(
        { error: 'Code is required and must be a non-empty string', code: 'MISSING_CODE' },
        { status: 400 }
      );
    }

    if (!type || !isValidBonusType(type)) {
      return NextResponse.json(
        { 
          error: `Type is required and must be one of: ${VALID_BONUS_TYPES.join(', ')}`, 
          code: 'INVALID_TYPE' 
        },
        { status: 400 }
      );
    }

    if (!validFrom || !isValidDateString(validFrom)) {
      return NextResponse.json(
        { error: 'validFrom is required and must be a valid date string', code: 'INVALID_VALID_FROM' },
        { status: 400 }
      );
    }

    if (!validUntil || !isValidDateString(validUntil)) {
      return NextResponse.json(
        { error: 'validUntil is required and must be a valid date string', code: 'INVALID_VALID_UNTIL' },
        { status: 400 }
      );
    }

    // Validate date range
    if (new Date(validFrom) >= new Date(validUntil)) {
      return NextResponse.json(
        { error: 'validFrom must be before validUntil', code: 'INVALID_DATE_RANGE' },
        { status: 400 }
      );
    }

    // Check code uniqueness
    const existingBonus = await db
      .select()
      .from(bonuses)
      .where(eq(bonuses.code, code.trim()))
      .limit(1);

    if (existingBonus.length > 0) {
      return NextResponse.json(
        { error: 'Bonus code already exists', code: 'DUPLICATE_CODE' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        { error: 'Amount must be a non-negative number', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      return NextResponse.json(
        { error: 'Percentage must be a number between 0 and 100', code: 'INVALID_PERCENTAGE' },
        { status: 400 }
      );
    }

    if (typeof maxAmount !== 'number' || maxAmount < 0) {
      return NextResponse.json(
        { error: 'Max amount must be a non-negative number', code: 'INVALID_MAX_AMOUNT' },
        { status: 400 }
      );
    }

    if (typeof wageringRequirement !== 'number' || wageringRequirement < 0) {
      return NextResponse.json(
        { error: 'Wagering requirement must be a non-negative number', code: 'INVALID_WAGERING' },
        { status: 400 }
      );
    }

    // Create new bonus
    const newBonus = await db
      .insert(bonuses)
      .values({
        name: name.trim(),
        code: code.trim(),
        type,
        amount,
        percentage,
        maxAmount,
        wageringRequirement,
        validFrom,
        validUntil,
        isActive,
        description: description?.trim() || null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newBonus[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if bonus exists
    const existingBonus = await db
      .select()
      .from(bonuses)
      .where(eq(bonuses.id, parseInt(id)))
      .limit(1);

    if (existingBonus.length === 0) {
      return NextResponse.json(
        { error: 'Bonus not found', code: 'BONUS_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      name,
      code,
      type,
      amount,
      percentage,
      maxAmount,
      wageringRequirement,
      validFrom,
      validUntil,
      isActive,
      description,
    } = body;

    const updates: Record<string, any> = {};

    // Validate and add name
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    // Validate and add code
    if (code !== undefined) {
      if (typeof code !== 'string' || code.trim() === '') {
        return NextResponse.json(
          { error: 'Code must be a non-empty string', code: 'INVALID_CODE' },
          { status: 400 }
        );
      }

      // Check code uniqueness (excluding current bonus)
      const duplicateCode = await db
        .select()
        .from(bonuses)
        .where(eq(bonuses.code, code.trim()))
        .limit(1);

      if (duplicateCode.length > 0 && duplicateCode[0].id !== parseInt(id)) {
        return NextResponse.json(
          { error: 'Bonus code already exists', code: 'DUPLICATE_CODE' },
          { status: 400 }
        );
      }

      updates.code = code.trim();
    }

    // Validate and add type
    if (type !== undefined) {
      if (!isValidBonusType(type)) {
        return NextResponse.json(
          { 
            error: `Type must be one of: ${VALID_BONUS_TYPES.join(', ')}`, 
            code: 'INVALID_TYPE' 
          },
          { status: 400 }
        );
      }
      updates.type = type;
    }

    // Validate and add amount
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount < 0) {
        return NextResponse.json(
          { error: 'Amount must be a non-negative number', code: 'INVALID_AMOUNT' },
          { status: 400 }
        );
      }
      updates.amount = amount;
    }

    // Validate and add percentage
    if (percentage !== undefined) {
      if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
        return NextResponse.json(
          { error: 'Percentage must be a number between 0 and 100', code: 'INVALID_PERCENTAGE' },
          { status: 400 }
        );
      }
      updates.percentage = percentage;
    }

    // Validate and add maxAmount
    if (maxAmount !== undefined) {
      if (typeof maxAmount !== 'number' || maxAmount < 0) {
        return NextResponse.json(
          { error: 'Max amount must be a non-negative number', code: 'INVALID_MAX_AMOUNT' },
          { status: 400 }
        );
      }
      updates.maxAmount = maxAmount;
    }

    // Validate and add wageringRequirement
    if (wageringRequirement !== undefined) {
      if (typeof wageringRequirement !== 'number' || wageringRequirement < 0) {
        return NextResponse.json(
          { error: 'Wagering requirement must be a non-negative number', code: 'INVALID_WAGERING' },
          { status: 400 }
        );
      }
      updates.wageringRequirement = wageringRequirement;
    }

    // Validate and add validFrom
    if (validFrom !== undefined) {
      if (!isValidDateString(validFrom)) {
        return NextResponse.json(
          { error: 'validFrom must be a valid date string', code: 'INVALID_VALID_FROM' },
          { status: 400 }
        );
      }
      updates.validFrom = validFrom;
    }

    // Validate and add validUntil
    if (validUntil !== undefined) {
      if (!isValidDateString(validUntil)) {
        return NextResponse.json(
          { error: 'validUntil must be a valid date string', code: 'INVALID_VALID_UNTIL' },
          { status: 400 }
        );
      }
      updates.validUntil = validUntil;
    }

    // Validate date range if both dates are being updated
    const finalValidFrom = updates.validFrom || existingBonus[0].validFrom;
    const finalValidUntil = updates.validUntil || existingBonus[0].validUntil;
    if (new Date(finalValidFrom) >= new Date(finalValidUntil)) {
      return NextResponse.json(
        { error: 'validFrom must be before validUntil', code: 'INVALID_DATE_RANGE' },
        { status: 400 }
      );
    }

    // Add isActive
    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'isActive must be a boolean', code: 'INVALID_IS_ACTIVE' },
          { status: 400 }
        );
      }
      updates.isActive = isActive;
    }

    // Add description
    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }

    // If no updates provided
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingBonus[0], { status: 200 });
    }

    // Update bonus
    const updated = await db
      .update(bonuses)
      .set(updates)
      .where(eq(bonuses.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if bonus exists
    const existingBonus = await db
      .select()
      .from(bonuses)
      .where(eq(bonuses.id, parseInt(id)))
      .limit(1);

    if (existingBonus.length === 0) {
      return NextResponse.json(
        { error: 'Bonus not found', code: 'BONUS_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete bonus
    const deleted = await db
      .delete(bonuses)
      .where(eq(bonuses.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Bonus deleted successfully',
        bonus: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}