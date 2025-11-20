import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import WebsiteVisit from '@/models/WebsiteVisit';
import { verifyToken } from '@/lib/jwt';
import { websiteVisitSchema } from '@/lib/validation';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    const source = searchParams.get('source');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (source) {
      filter.source = source;
    }

    if (startDate || endDate) {
      filter.visitDate = {};
      if (startDate) {
        filter.visitDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.visitDate.$lte = new Date(endDate);
      }
    }

    const visits = await WebsiteVisit.find(filter)
      .sort({ visitDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WebsiteVisit.countDocuments(filter);

    return NextResponse.json({
      data: visits,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching website visits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website visits' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const validation = websiteVisitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.error.flatten()
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newVisit = new WebsiteVisit({
      ...body,
      visitDate: body.visitDate ? new Date(body.visitDate) : new Date()
    });

    const savedVisit = await newVisit.save();

    return NextResponse.json(
      { 
        message: 'Website visit recorded successfully', 
        data: savedVisit 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating website visit:', error);
    return NextResponse.json(
      { error: 'Failed to record website visit' },
      { status: 500 }
    );
  }
}