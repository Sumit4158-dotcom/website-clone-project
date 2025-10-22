import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, and, or, ne } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    const user = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      phone: users.phone,
      fullName: users.fullName,
      balance: users.balance,
      bonusBalance: users.bonusBalance,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      lastLogin: users.lastLogin,
      status: users.status,
      kycVerified: users.kycVerified,
    })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json(user[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { fullName, phone, email } = body;

    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate that admin-only fields are not being updated
    const adminOnlyFields = ['balance', 'bonusBalance', 'status', 'kycVerified'];
    const hasAdminOnlyFields = adminOnlyFields.some(field => field in body);
    
    if (hasAdminOnlyFields) {
      return NextResponse.json({ 
        error: "Cannot update balance, bonusBalance, status, or kycVerified fields",
        code: "ADMIN_ONLY_FIELDS" 
      }, { status: 400 });
    }

    // Validate email uniqueness if changed
    if (email && email !== existingUser[0].email) {
      const trimmedEmail = email.trim().toLowerCase();
      
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        return NextResponse.json({ 
          error: "Invalid email format",
          code: "INVALID_EMAIL" 
        }, { status: 400 });
      }

      const emailExists = await db.select()
        .from(users)
        .where(
          and(
            eq(users.email, trimmedEmail),
            ne(users.id, parseInt(userId))
          )
        )
        .limit(1);

      if (emailExists.length > 0) {
        return NextResponse.json({ 
          error: "Email already exists",
          code: "EMAIL_EXISTS" 
        }, { status: 400 });
      }
    }

    // Build update object with only allowed fields
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (fullName !== undefined) {
      const trimmedFullName = fullName.trim();
      if (!trimmedFullName) {
        return NextResponse.json({ 
          error: "Full name cannot be empty",
          code: "INVALID_FULL_NAME" 
        }, { status: 400 });
      }
      updates.fullName = trimmedFullName;
    }

    if (phone !== undefined) {
      updates.phone = phone ? phone.trim() : phone;
    }

    if (email !== undefined) {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        return NextResponse.json({ 
          error: "Invalid email format",
          code: "INVALID_EMAIL" 
        }, { status: 400 });
      }
      updates.email = trimmedEmail;
    }

    const updated = await db.update(users)
      .set(updates)
      .where(eq(users.id, parseInt(userId)))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        phone: users.phone,
        fullName: users.fullName,
        balance: users.balance,
        bonusBalance: users.bonusBalance,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
        status: users.status,
        kycVerified: users.kycVerified,
      });

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update user',
        code: "UPDATE_FAILED" 
      }, { status: 500 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}