import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions, users } from '@/db/schema';
import { eq, and, gte, lte, desc, asc, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single transaction by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const transaction = await db.select()
        .from(transactions)
        .where(eq(transactions.id, parseInt(id)))
        .limit(1);

      if (transaction.length === 0) {
        return NextResponse.json({ 
          error: 'Transaction not found',
          code: "NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(transaction[0], { status: 200 });
    }

    // List transactions with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';

    let query = db.select().from(transactions);

    // Build filter conditions
    const conditions = [];

    if (userId) {
      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        return NextResponse.json({ 
          error: "Valid userId is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(transactions.userId, userIdNum));
    }

    if (type) {
      const validTypes = ['deposit', 'withdrawal', 'bet', 'win', 'bonus', 'refund'];
      if (!validTypes.includes(type)) {
        return NextResponse.json({ 
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
          code: "INVALID_TYPE" 
        }, { status: 400 });
      }
      conditions.push(eq(transactions.type, type));
    }

    if (status) {
      const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      conditions.push(eq(transactions.status, status));
    }

    if (paymentMethod) {
      conditions.push(eq(transactions.paymentMethod, paymentMethod));
    }

    if (startDate) {
      conditions.push(gte(transactions.createdAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(transactions.createdAt, endDate));
    }

    // Apply filters
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sortField === 'amount' ? transactions.amount : transactions.createdAt;
    query = order === 'asc' ? query.orderBy(asc(sortColumn)) : query.orderBy(desc(sortColumn));

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, amount, balanceBefore, balanceAfter, status, paymentMethod, transactionRef, description, completedAt } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ 
        error: "type is required",
        code: "MISSING_TYPE" 
      }, { status: 400 });
    }

    const validTypes = ['deposit', 'withdrawal', 'bet', 'win', 'bonus', 'refund'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
        code: "INVALID_TYPE" 
      }, { status: 400 });
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json({ 
        error: "amount is required",
        code: "MISSING_AMOUNT" 
      }, { status: 400 });
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json({ 
        error: "amount must be a valid number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    if (balanceBefore === undefined || balanceBefore === null) {
      return NextResponse.json({ 
        error: "balanceBefore is required",
        code: "MISSING_BALANCE_BEFORE" 
      }, { status: 400 });
    }

    if (typeof balanceBefore !== 'number' || isNaN(balanceBefore)) {
      return NextResponse.json({ 
        error: "balanceBefore must be a valid number",
        code: "INVALID_BALANCE_BEFORE" 
      }, { status: 400 });
    }

    if (balanceAfter === undefined || balanceAfter === null) {
      return NextResponse.json({ 
        error: "balanceAfter is required",
        code: "MISSING_BALANCE_AFTER" 
      }, { status: 400 });
    }

    if (typeof balanceAfter !== 'number' || isNaN(balanceAfter)) {
      return NextResponse.json({ 
        error: "balanceAfter must be a valid number",
        code: "INVALID_BALANCE_AFTER" 
      }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ 
        error: "status is required",
        code: "MISSING_STATUS" 
      }, { status: 400 });
    }

    const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate userId exists
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 400 });
    }

    // Create transaction
    const newTransaction = await db.insert(transactions)
      .values({
        userId: parseInt(userId),
        type,
        amount: parseFloat(amount),
        balanceBefore: parseFloat(balanceBefore),
        balanceAfter: parseFloat(balanceAfter),
        status,
        paymentMethod: paymentMethod?.trim() || null,
        transactionRef: transactionRef?.trim() || null,
        description: description?.trim() || null,
        completedAt: completedAt || null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newTransaction[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { status, completedAt, description } = body;

    // Check if transaction exists
    const existing = await db.select()
      .from(transactions)
      .where(eq(transactions.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Transaction not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
    }

    // Build update object
    const updates: any = {};

    if (status !== undefined) {
      updates.status = status;
    }

    if (completedAt !== undefined) {
      updates.completedAt = completedAt;
    }

    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }

    // Update transaction
    const updated = await db.update(transactions)
      .set(updates)
      .where(eq(transactions.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if transaction exists
    const existing = await db.select()
      .from(transactions)
      .where(eq(transactions.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Transaction not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete transaction
    const deleted = await db.delete(transactions)
      .where(eq(transactions.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Transaction deleted successfully',
      transaction: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}