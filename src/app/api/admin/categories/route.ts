import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single category by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const category = await db.select()
        .from(categories)
        .where(eq(categories.id, parseInt(id)))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json({ 
          error: 'Category not found',
          code: 'CATEGORY_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(category[0], { status: 200 });
    }

    // List categories with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const isActiveParam = searchParams.get('isActive');
    const sort = searchParams.get('sort') ?? 'displayOrder';
    const order = searchParams.get('order') ?? 'asc';

    let query = db.select().from(categories);

    // Build where conditions
    const conditions = [];

    // Search by name
    if (search) {
      conditions.push(like(categories.name, `%${search}%`));
    }

    // Filter by isActive
    if (isActiveParam !== null) {
      const isActiveValue = isActiveParam === 'true';
      conditions.push(eq(categories.isActive, isActiveValue));
    }

    // Apply where conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply sorting
    const sortColumn = sort === 'name' ? categories.name : 
                       sort === 'displayOrder' ? categories.displayOrder : 
                       categories.displayOrder;
    
    const orderFn = order === 'desc' ? desc : asc;
    query = query.orderBy(orderFn(sortColumn));

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
    const { name, slug, iconUrl, displayOrder, isActive } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json({ 
        error: "Slug is required and must be a non-empty string",
        code: "MISSING_SLUG" 
      }, { status: 400 });
    }

    // Check slug uniqueness
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.slug, slug.trim()))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json({ 
        error: "A category with this slug already exists",
        code: "SLUG_EXISTS" 
      }, { status: 400 });
    }

    // Validate optional fields
    if (iconUrl !== undefined && iconUrl !== null && typeof iconUrl !== 'string') {
      return NextResponse.json({ 
        error: "iconUrl must be a string",
        code: "INVALID_ICON_URL" 
      }, { status: 400 });
    }

    if (displayOrder !== undefined && displayOrder !== null) {
      if (typeof displayOrder !== 'number' || !Number.isInteger(displayOrder)) {
        return NextResponse.json({ 
          error: "displayOrder must be an integer",
          code: "INVALID_DISPLAY_ORDER" 
        }, { status: 400 });
      }
    }

    if (isActive !== undefined && isActive !== null && typeof isActive !== 'boolean') {
      return NextResponse.json({ 
        error: "isActive must be a boolean",
        code: "INVALID_IS_ACTIVE" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData = {
      name: name.trim(),
      slug: slug.trim(),
      iconUrl: iconUrl ? iconUrl.trim() : null,
      displayOrder: displayOrder ?? 0,
      isActive: isActive ?? true,
      createdAt: new Date().toISOString()
    };

    // Insert new category
    const newCategory = await db.insert(categories)
      .values(insertData)
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });

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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const categoryId = parseInt(id);

    // Check if category exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json({ 
        error: 'Category not found',
        code: 'CATEGORY_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, slug, iconUrl, displayOrder, isActive } = body;

    // Validate fields if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ 
          error: "Name must be a non-empty string",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
    }

    if (slug !== undefined) {
      if (typeof slug !== 'string' || slug.trim().length === 0) {
        return NextResponse.json({ 
          error: "Slug must be a non-empty string",
          code: "INVALID_SLUG" 
        }, { status: 400 });
      }

      // Check slug uniqueness (excluding current category)
      const slugCheck = await db.select()
        .from(categories)
        .where(and(
          eq(categories.slug, slug.trim()),
          eq(categories.id, categoryId)
        ))
        .limit(1);

      if (slugCheck.length === 0) {
        const existingSlug = await db.select()
          .from(categories)
          .where(eq(categories.slug, slug.trim()))
          .limit(1);

        if (existingSlug.length > 0) {
          return NextResponse.json({ 
            error: "A category with this slug already exists",
            code: "SLUG_EXISTS" 
          }, { status: 400 });
        }
      }
    }

    if (iconUrl !== undefined && iconUrl !== null && typeof iconUrl !== 'string') {
      return NextResponse.json({ 
        error: "iconUrl must be a string",
        code: "INVALID_ICON_URL" 
      }, { status: 400 });
    }

    if (displayOrder !== undefined && displayOrder !== null) {
      if (typeof displayOrder !== 'number' || !Number.isInteger(displayOrder)) {
        return NextResponse.json({ 
          error: "displayOrder must be an integer",
          code: "INVALID_DISPLAY_ORDER" 
        }, { status: 400 });
      }
    }

    if (isActive !== undefined && isActive !== null && typeof isActive !== 'boolean') {
      return NextResponse.json({ 
        error: "isActive must be a boolean",
        code: "INVALID_IS_ACTIVE" 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: Record<string, any> = {};

    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl ? iconUrl.trim() : null;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update category
    const updated = await db.update(categories)
      .set(updateData)
      .where(eq(categories.id, categoryId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update category',
        code: 'UPDATE_FAILED' 
      }, { status: 500 });
    }

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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const categoryId = parseInt(id);

    // Check if category exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json({ 
        error: 'Category not found',
        code: 'CATEGORY_NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete category
    const deleted = await db.delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete category',
        code: 'DELETE_FAILED' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Category deleted successfully',
      category: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}