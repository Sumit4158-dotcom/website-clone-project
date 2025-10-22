import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

// Helper function to omit passwordHash from user objects
function sanitizeUser(user: any) {
  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single user by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const user = await db.select()
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(sanitizeUser(user[0]), { status: 200 });
    }

    // List users with pagination and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const kycVerified = searchParams.get('kycVerified');

    let query = db.select().from(users);

    // Build filter conditions
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(users.email, `%${search}%`),
          like(users.username, `%${search}%`),
          like(users.fullName, `%${search}%`)
        )
      );
    }

    // Status filter
    if (status && ['active', 'suspended', 'banned'].includes(status)) {
      conditions.push(eq(users.status, status));
    }

    // KYC verified filter
    if (kycVerified !== null && (kycVerified === 'true' || kycVerified === 'false')) {
      conditions.push(eq(users.kycVerified, kycVerified === 'true'));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting, pagination
    const results = await query
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // Sanitize results
    const sanitizedResults = results.map(user => sanitizeUser(user));

    return NextResponse.json(sanitizedResults, { status: 200 });

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
    const { email, username, passwordHash, fullName, phone, status, balance, bonusBalance, kycVerified } = body;

    // Validate required fields
    if (!email || !email.trim()) {
      return NextResponse.json({ 
        error: "Email is required",
        code: "MISSING_EMAIL" 
      }, { status: 400 });
    }

    if (!username || !username.trim()) {
      return NextResponse.json({ 
        error: "Username is required",
        code: "MISSING_USERNAME" 
      }, { status: 400 });
    }

    if (!passwordHash || !passwordHash.trim()) {
      return NextResponse.json({ 
        error: "Password hash is required",
        code: "MISSING_PASSWORD_HASH" 
      }, { status: 400 });
    }

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ 
        error: "Full name is required",
        code: "MISSING_FULL_NAME" 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format",
        code: "INVALID_EMAIL" 
      }, { status: 400 });
    }

    // Check email uniqueness
    const existingEmail = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingEmail.length > 0) {
      return NextResponse.json({ 
        error: "Email already exists",
        code: "EMAIL_EXISTS" 
      }, { status: 400 });
    }

    // Check username uniqueness
    const existingUsername = await db.select()
      .from(users)
      .where(eq(users.username, username.trim()))
      .limit(1);

    if (existingUsername.length > 0) {
      return NextResponse.json({ 
        error: "Username already exists",
        code: "USERNAME_EXISTS" 
      }, { status: 400 });
    }

    // Validate status if provided
    if (status && !['active', 'suspended', 'banned'].includes(status)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: active, suspended, banned",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData = {
      email: email.toLowerCase().trim(),
      username: username.trim(),
      passwordHash: passwordHash.trim(),
      fullName: fullName.trim(),
      phone: phone ? phone.trim() : null,
      status: status || 'active',
      balance: balance !== undefined ? balance : 0,
      bonusBalance: bonusBalance !== undefined ? bonusBalance : 0,
      kycVerified: kycVerified !== undefined ? kycVerified : false,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
    };

    const newUser = await db.insert(users)
      .values(insertData)
      .returning();

    return NextResponse.json(sanitizeUser(newUser[0]), { status: 201 });

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

    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { email, username, fullName, phone, status, balance, bonusBalance, kycVerified, lastLogin } = body;

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ 
          error: "Invalid email format",
          code: "INVALID_EMAIL" 
        }, { status: 400 });
      }

      // Check email uniqueness (excluding current user)
      const existingEmail = await db.select()
        .from(users)
        .where(
          and(
            eq(users.email, email.toLowerCase().trim()),
            or(
              eq(users.id, parseInt(id))
            )
          )
        )
        .limit(2);

      if (existingEmail.length > 1 || (existingEmail.length === 1 && existingEmail[0].id !== parseInt(id))) {
        return NextResponse.json({ 
          error: "Email already exists",
          code: "EMAIL_EXISTS" 
        }, { status: 400 });
      }
    }

    // Check username uniqueness if provided
    if (username) {
      const existingUsername = await db.select()
        .from(users)
        .where(
          and(
            eq(users.username, username.trim()),
            or(
              eq(users.id, parseInt(id))
            )
          )
        )
        .limit(2);

      if (existingUsername.length > 1 || (existingUsername.length === 1 && existingUsername[0].id !== parseInt(id))) {
        return NextResponse.json({ 
          error: "Username already exists",
          code: "USERNAME_EXISTS" 
        }, { status: 400 });
      }
    }

    // Validate status if provided
    if (status && !['active', 'suspended', 'banned'].includes(status)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: active, suspended, banned",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (username !== undefined) updateData.username = username.trim();
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (status !== undefined) updateData.status = status;
    if (balance !== undefined) updateData.balance = balance;
    if (bonusBalance !== undefined) updateData.bonusBalance = bonusBalance;
    if (kycVerified !== undefined) updateData.kycVerified = kycVerified;
    if (lastLogin !== undefined) updateData.lastLogin = lastLogin;

    const updated = await db.update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(id)))
      .returning();

    return NextResponse.json(sanitizeUser(updated[0]), { status: 200 });

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

    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'User deleted successfully',
      user: sanitizeUser(deleted[0])
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}