import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { games, categories } from '@/db/schema';
import { eq, like, and, or, desc, asc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single game by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const game = await db
        .select()
        .from(games)
        .where(eq(games.id, parseInt(id)))
        .limit(1);

      if (game.length === 0) {
        return NextResponse.json(
          { error: 'Game not found', code: 'GAME_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(game[0], { status: 200 });
    }

    // List games with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const provider = searchParams.get('provider');
    const isFeatured = searchParams.get('isFeatured');
    const isActive = searchParams.get('isActive');
    const sort = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(like(games.name, `%${search}%`));
    }

    if (categoryId) {
      if (isNaN(parseInt(categoryId))) {
        return NextResponse.json(
          { error: 'Valid categoryId is required', code: 'INVALID_CATEGORY_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(games.categoryId, parseInt(categoryId)));
    }

    if (provider) {
      conditions.push(eq(games.provider, provider));
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      const featuredValue = isFeatured === 'true';
      conditions.push(eq(games.isFeatured, featuredValue));
    }

    if (isActive !== null && isActive !== undefined) {
      const activeValue = isActive === 'true';
      conditions.push(eq(games.isActive, activeValue));
    }

    // Build query
    let query = db.select().from(games);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const validSortFields = ['playCount', 'createdAt'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'asc' ? asc : desc;

    if (sortField === 'playCount') {
      query = query.orderBy(sortOrder(games.playCount));
    } else {
      query = query.orderBy(sortOrder(games.createdAt));
    }

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
    const { name, slug, categoryId, provider, imageUrl, thumbnailUrl, description, minBet, maxBet, rtp, isFeatured, isActive, playCount } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { error: 'Slug is required and must be a non-empty string', code: 'MISSING_SLUG' },
        { status: 400 }
      );
    }

    if (!categoryId || isNaN(parseInt(categoryId.toString()))) {
      return NextResponse.json(
        { error: 'Valid categoryId is required', code: 'MISSING_CATEGORY_ID' },
        { status: 400 }
      );
    }

    if (!provider || typeof provider !== 'string' || provider.trim() === '') {
      return NextResponse.json(
        { error: 'Provider is required and must be a non-empty string', code: 'MISSING_PROVIDER' },
        { status: 400 }
      );
    }

    // Validate numeric fields if provided
    if (minBet !== undefined && minBet !== null) {
      const minBetNum = parseFloat(minBet.toString());
      if (isNaN(minBetNum) || minBetNum < 0) {
        return NextResponse.json(
          { error: 'minBet must be a valid positive number', code: 'INVALID_MIN_BET' },
          { status: 400 }
        );
      }
    }

    if (maxBet !== undefined && maxBet !== null) {
      const maxBetNum = parseFloat(maxBet.toString());
      if (isNaN(maxBetNum) || maxBetNum < 0) {
        return NextResponse.json(
          { error: 'maxBet must be a valid positive number', code: 'INVALID_MAX_BET' },
          { status: 400 }
        );
      }
    }

    if (rtp !== undefined && rtp !== null) {
      const rtpNum = parseFloat(rtp.toString());
      if (isNaN(rtpNum) || rtpNum < 0 || rtpNum > 100) {
        return NextResponse.json(
          { error: 'rtp must be a valid number between 0 and 100', code: 'INVALID_RTP' },
          { status: 400 }
        );
      }
    }

    if (playCount !== undefined && playCount !== null) {
      const playCountNum = parseInt(playCount.toString());
      if (isNaN(playCountNum) || playCountNum < 0) {
        return NextResponse.json(
          { error: 'playCount must be a valid positive integer', code: 'INVALID_PLAY_COUNT' },
          { status: 400 }
        );
      }
    }

    // Check if category exists
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, parseInt(categoryId.toString())))
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json(
        { error: 'Category not found', code: 'CATEGORY_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existingGame = await db
      .select()
      .from(games)
      .where(eq(games.slug, slug.trim()))
      .limit(1);

    if (existingGame.length > 0) {
      return NextResponse.json(
        { error: 'Slug already exists', code: 'SLUG_EXISTS' },
        { status: 400 }
      );
    }

    // Prepare insert data with defaults
    const now = new Date().toISOString();
    const insertData = {
      name: name.trim(),
      slug: slug.trim(),
      categoryId: parseInt(categoryId.toString()),
      provider: provider.trim(),
      imageUrl: imageUrl ? imageUrl.trim() : null,
      thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : null,
      description: description ? description.trim() : null,
      minBet: minBet !== undefined && minBet !== null ? parseFloat(minBet.toString()) : 0.10,
      maxBet: maxBet !== undefined && maxBet !== null ? parseFloat(maxBet.toString()) : 1000.00,
      rtp: rtp !== undefined && rtp !== null ? parseFloat(rtp.toString()) : 96.00,
      isFeatured: isFeatured === true || isFeatured === 'true' ? true : false,
      isActive: isActive === false || isActive === 'false' ? false : true,
      playCount: playCount !== undefined && playCount !== null ? parseInt(playCount.toString()) : 0,
      createdAt: now,
      updatedAt: now,
    };

    const newGame = await db.insert(games).values(insertData).returning();

    return NextResponse.json(newGame[0], { status: 201 });
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

    const body = await request.json();
    const { name, slug, categoryId, provider, imageUrl, thumbnailUrl, description, minBet, maxBet, rtp, isFeatured, isActive, playCount } = body;

    // Check if game exists
    const existingGame = await db
      .select()
      .from(games)
      .where(eq(games.id, parseInt(id)))
      .limit(1);

    if (existingGame.length === 0) {
      return NextResponse.json(
        { error: 'Game not found', code: 'GAME_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate fields if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return NextResponse.json(
        { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (slug !== undefined && (typeof slug !== 'string' || slug.trim() === '')) {
      return NextResponse.json(
        { error: 'Slug must be a non-empty string', code: 'INVALID_SLUG' },
        { status: 400 }
      );
    }

    if (categoryId !== undefined && isNaN(parseInt(categoryId.toString()))) {
      return NextResponse.json(
        { error: 'Valid categoryId is required', code: 'INVALID_CATEGORY_ID' },
        { status: 400 }
      );
    }

    if (provider !== undefined && (typeof provider !== 'string' || provider.trim() === '')) {
      return NextResponse.json(
        { error: 'Provider must be a non-empty string', code: 'INVALID_PROVIDER' },
        { status: 400 }
      );
    }

    if (minBet !== undefined && minBet !== null) {
      const minBetNum = parseFloat(minBet.toString());
      if (isNaN(minBetNum) || minBetNum < 0) {
        return NextResponse.json(
          { error: 'minBet must be a valid positive number', code: 'INVALID_MIN_BET' },
          { status: 400 }
        );
      }
    }

    if (maxBet !== undefined && maxBet !== null) {
      const maxBetNum = parseFloat(maxBet.toString());
      if (isNaN(maxBetNum) || maxBetNum < 0) {
        return NextResponse.json(
          { error: 'maxBet must be a valid positive number', code: 'INVALID_MAX_BET' },
          { status: 400 }
        );
      }
    }

    if (rtp !== undefined && rtp !== null) {
      const rtpNum = parseFloat(rtp.toString());
      if (isNaN(rtpNum) || rtpNum < 0 || rtpNum > 100) {
        return NextResponse.json(
          { error: 'rtp must be a valid number between 0 and 100', code: 'INVALID_RTP' },
          { status: 400 }
        );
      }
    }

    if (playCount !== undefined && playCount !== null) {
      const playCountNum = parseInt(playCount.toString());
      if (isNaN(playCountNum) || playCountNum < 0) {
        return NextResponse.json(
          { error: 'playCount must be a valid positive integer', code: 'INVALID_PLAY_COUNT' },
          { status: 400 }
        );
      }
    }

    // Check if category exists if categoryId is being updated
    if (categoryId !== undefined) {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, parseInt(categoryId.toString())))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json(
          { error: 'Category not found', code: 'CATEGORY_NOT_FOUND' },
          { status: 400 }
        );
      }
    }

    // Check slug uniqueness if slug is being updated
    if (slug !== undefined) {
      const existingSlugGame = await db
        .select()
        .from(games)
        .where(and(eq(games.slug, slug.trim()), sql`${games.id} != ${parseInt(id)}`))
        .limit(1);

      if (existingSlugGame.length > 0) {
        return NextResponse.json(
          { error: 'Slug already exists', code: 'SLUG_EXISTS' },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) updates.name = name.trim();
    if (slug !== undefined) updates.slug = slug.trim();
    if (categoryId !== undefined) updates.categoryId = parseInt(categoryId.toString());
    if (provider !== undefined) updates.provider = provider.trim();
    if (imageUrl !== undefined) updates.imageUrl = imageUrl ? imageUrl.trim() : null;
    if (thumbnailUrl !== undefined) updates.thumbnailUrl = thumbnailUrl ? thumbnailUrl.trim() : null;
    if (description !== undefined) updates.description = description ? description.trim() : null;
    if (minBet !== undefined && minBet !== null) updates.minBet = parseFloat(minBet.toString());
    if (maxBet !== undefined && maxBet !== null) updates.maxBet = parseFloat(maxBet.toString());
    if (rtp !== undefined && rtp !== null) updates.rtp = parseFloat(rtp.toString());
    if (isFeatured !== undefined) updates.isFeatured = isFeatured === true || isFeatured === 'true';
    if (isActive !== undefined) updates.isActive = isActive === true || isActive === 'true';
    if (playCount !== undefined && playCount !== null) updates.playCount = parseInt(playCount.toString());

    const updatedGame = await db
      .update(games)
      .set(updates)
      .where(eq(games.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedGame[0], { status: 200 });
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

    // Check if game exists
    const existingGame = await db
      .select()
      .from(games)
      .where(eq(games.id, parseInt(id)))
      .limit(1);

    if (existingGame.length === 0) {
      return NextResponse.json(
        { error: 'Game not found', code: 'GAME_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedGame = await db
      .delete(games)
      .where(eq(games.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Game deleted successfully',
        game: deletedGame[0],
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