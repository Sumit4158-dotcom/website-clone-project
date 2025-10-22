import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminLogs } from '@/db/schema';
import { eq, and, gte, lte, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: 'Valid ID is required',
            code: 'INVALID_ID' 
          },
          { status: 400 }
        );
      }

      const record = await db.select()
        .from(adminLogs)
        .where(eq(adminLogs.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Admin log not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Filter parameters
    const adminId = searchParams.get('adminId');
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Sorting parameters
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    // Build where conditions
    const conditions = [];

    if (adminId) {
      if (isNaN(parseInt(adminId))) {
        return NextResponse.json(
          { 
            error: 'Valid adminId is required',
            code: 'INVALID_ADMIN_ID' 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(adminLogs.adminId, parseInt(adminId)));
    }

    if (action) {
      conditions.push(eq(adminLogs.action, action));
    }

    if (entityType) {
      conditions.push(eq(adminLogs.entityType, entityType));
    }

    if (entityId) {
      if (isNaN(parseInt(entityId))) {
        return NextResponse.json(
          { 
            error: 'Valid entityId is required',
            code: 'INVALID_ENTITY_ID' 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(adminLogs.entityId, parseInt(entityId)));
    }

    if (startDate) {
      const startDateISO = new Date(startDate);
      if (isNaN(startDateISO.getTime())) {
        return NextResponse.json(
          { 
            error: 'Valid startDate is required (ISO format)',
            code: 'INVALID_START_DATE' 
          },
          { status: 400 }
        );
      }
      conditions.push(gte(adminLogs.createdAt, startDateISO.toISOString()));
    }

    if (endDate) {
      const endDateISO = new Date(endDate);
      if (isNaN(endDateISO.getTime())) {
        return NextResponse.json(
          { 
            error: 'Valid endDate is required (ISO format)',
            code: 'INVALID_END_DATE' 
          },
          { status: 400 }
        );
      }
      conditions.push(lte(adminLogs.createdAt, endDateISO.toISOString()));
    }

    // Build query
    let query = db.select().from(adminLogs);

    // Apply filters
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    if (sortField === 'createdAt') {
      query = sortOrder === 'asc' 
        ? query.orderBy(asc(adminLogs.createdAt))
        : query.orderBy(desc(adminLogs.createdAt));
    } else {
      // Default to createdAt DESC if invalid sort field
      query = query.orderBy(desc(adminLogs.createdAt));
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