import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { providers } from '@/db/schema';
import { eq, like, and, or, desc, asc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single provider fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const provider = await db.select()
        .from(providers)
        .where(eq(providers.id, parseInt(id)))
        .limit(1);

      if (provider.length === 0) {
        return NextResponse.json({ 
          error: 'Provider not found',
          code: 'PROVIDER_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(provider[0], { status: 200 });
    }

    // List providers with pagination, search, filtering, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const isActiveParam = searchParams.get('isActive');
    const sortBy = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';

    let query = db.select().from(providers);

    // Build where conditions
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(like(providers.name, `%${search}%`));
    }

    // isActive filter
    if (isActiveParam !== null) {
      const isActiveValue = isActiveParam === 'true' ? 1 : 0;
      conditions.push(eq(providers.isActive, isActiveValue));
    }

    // Apply where conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sortBy === 'gameCount' ? providers.gameCount 
                     : sortBy === 'name' ? providers.name 
                     : providers.createdAt;
    
    const orderDirection = order === 'asc' ? asc(sortColumn) : desc(sortColumn);
    query = query.orderBy(orderDirection);

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
    const { name, slug, logoUrl, isActive, gameCount } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ 
        error: "Name and slug are required fields",
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Validate name
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: "Name must be a non-empty string",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    // Validate slug
    if (typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json({ 
        error: "Slug must be a non-empty string",
        code: "INVALID_SLUG" 
      }, { status: 400 });
    }

    // Validate slug uniqueness
    const existingProvider = await db.select()
      .from(providers)
      .where(eq(providers.slug, slug.trim()))
      .limit(1);

    if (existingProvider.length > 0) {
      return NextResponse.json({ 
        error: "A provider with this slug already exists",
        code: "DUPLICATE_SLUG" 
      }, { status: 400 });
    }

    // Validate logoUrl if provided
    if (logoUrl !== undefined && logoUrl !== null && typeof logoUrl !== 'string') {
      return NextResponse.json({ 
        error: "Logo URL must be a string",
        code: "INVALID_LOGO_URL" 
      }, { status: 400 });
    }

    // Validate isActive if provided
    if (isActive !== undefined && typeof isActive !== 'boolean') {
      return NextResponse.json({ 
        error: "isActive must be a boolean",
        code: "INVALID_IS_ACTIVE" 
      }, { status: 400 });
    }

    // Validate gameCount if provided
    if (gameCount !== undefined && (typeof gameCount !== 'number' || gameCount < 0 || !Number.isInteger(gameCount))) {
      return NextResponse.json({ 
        error: "Game count must be a non-negative integer",
        code: "INVALID_GAME_COUNT" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData = {
      name: name.trim(),
      slug: slug.trim(),
      logoUrl: logoUrl ? logoUrl.trim() : null,
      isActive: isActive !== undefined ? (isActive ? 1 : 0) : 1,
      gameCount: gameCount !== undefined ? gameCount : 0,
      createdAt: new Date().toISOString()
    };

    // Insert new provider
    const newProvider = await db.insert(providers)
      .values(insertData)
      .returning();

    return NextResponse.json(newProvider[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { name, slug, logoUrl, isActive, gameCount } = body;

    // Check if provider exists
    const existingProvider = await db.select()
      .from(providers)
      .where(eq(providers.id, parseInt(id)))
      .limit(1);

    if (existingProvider.length === 0) {
      return NextResponse.json({ 
        error: 'Provider not found',
        code: 'PROVIDER_NOT_FOUND' 
      }, { status: 404 });
    }

    // Validate name if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json({ 
        error: "Name must be a non-empty string",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    // Validate slug if provided
    if (slug !== undefined && (typeof slug !== 'string' || slug.trim().length === 0)) {
      return NextResponse.json({ 
        error: "Slug must be a non-empty string",
        code: "INVALID_SLUG" 
      }, { status: 400 });
    }

    // Validate slug uniqueness if provided
    if (slug !== undefined) {
      const slugExists = await db.select()
        .from(providers)
        .where(and(
          eq(providers.slug, slug.trim()),
          sql`${providers.id} != ${parseInt(id)}`
        ))
        .limit(1);

      if (slugExists.length > 0) {
        return NextResponse.json({ 
          error: "A provider with this slug already exists",
          code: "DUPLICATE_SLUG" 
        }, { status: 400 });
      }
    }

    // Validate logoUrl if provided
    if (logoUrl !== undefined && logoUrl !== null && typeof logoUrl !== 'string') {
      return NextResponse.json({ 
        error: "Logo URL must be a string",
        code: "INVALID_LOGO_URL" 
      }, { status: 400 });
    }

    // Validate isActive if provided
    if (isActive !== undefined && typeof isActive !== 'boolean') {
      return NextResponse.json({ 
        error: "isActive must be a boolean",
        code: "INVALID_IS_ACTIVE" 
      }, { status: 400 });
    }

    // Validate gameCount if provided
    if (gameCount !== undefined && (typeof gameCount !== 'number' || gameCount < 0 || !Number.isInteger(gameCount))) {
      return NextResponse.json({ 
        error: "Game count must be a non-negative integer",
        code: "INVALID_GAME_COUNT" 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl ? logoUrl.trim() : null;
    if (isActive !== undefined) updateData.isActive = isActive ? 1 : 0;
    if (gameCount !== undefined) updateData.gameCount = gameCount;

    // Update provider
    const updated = await db.update(providers)
      .set(updateData)
      .where(eq(providers.id, parseInt(id)))
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if provider exists
    const existingProvider = await db.select()
      .from(providers)
      .where(eq(providers.id, parseInt(id)))
      .limit(1);

    if (existingProvider.length === 0) {
      return NextResponse.json({ 
        error: 'Provider not found',
        code: 'PROVIDER_NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete provider
    const deleted = await db.delete(providers)
      .where(eq(providers.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Provider deleted successfully',
      provider: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}