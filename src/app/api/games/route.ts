import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { games } from '@/db/schema';
import { eq, like, and, desc, asc, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Search parameter
    const search = searchParams.get('search');
    
    // Filter parameters
    const categoryId = searchParams.get('categoryId');
    const provider = searchParams.get('provider');
    const isFeatured = searchParams.get('featured');
    
    // Sort parameters
    const sort = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';

    // Build conditions array
    const conditions = [eq(games.isActive, true)];

    // Add search condition
    if (search) {
      conditions.push(
        or(
          like(games.name, `%${search}%`),
          like(games.description, `%${search}%`),
          like(games.provider, `%${search}%`)
        )
      );
    }

    // Add filter conditions
    if (categoryId && !isNaN(parseInt(categoryId))) {
      conditions.push(eq(games.categoryId, parseInt(categoryId)));
    }

    if (provider) {
      conditions.push(eq(games.provider, provider));
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      const featuredValue = isFeatured === 'true' || isFeatured === '1';
      conditions.push(eq(games.isFeatured, featuredValue));
    }

    // Build query with conditions
    let query = db.select({
      id: games.id,
      name: games.name,
      slug: games.slug,
      categoryId: games.categoryId,
      provider: games.provider,
      imageUrl: games.imageUrl,
      thumbnailUrl: games.thumbnailUrl,
      description: games.description,
      minBet: games.minBet,
      maxBet: games.maxBet,
      rtp: games.rtp,
      isFeatured: games.isFeatured,
      playCount: games.playCount,
      createdAt: games.createdAt,
    }).from(games);

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (sort) {
      case 'playCount':
        query = query.orderBy(order === 'asc' ? asc(games.playCount) : desc(games.playCount));
        break;
      case 'name':
        query = query.orderBy(order === 'asc' ? asc(games.name) : desc(games.name));
        break;
      case 'createdAt':
      default:
        query = query.orderBy(order === 'asc' ? asc(games.createdAt) : desc(games.createdAt));
        break;
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET games error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}