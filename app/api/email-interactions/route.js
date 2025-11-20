import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import EmailInteraction from '@/models/EmailInteraction';
import { verifyToken } from '@/lib/jwt';
import { emailInteractionSchema } from '@/lib/validation';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const interactions = await EmailInteraction.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      data: interactions,
      count: interactions.length
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = emailInteractionSchema.parse(body);

    await connectToDatabase();

    const newInteraction = new EmailInteraction({
      ...validatedData,
      createdAt: new Date()
    });

    const savedInteraction = await newInteraction.save();

    return NextResponse.json({
      message: 'Email interaction created successfully',
      data: savedInteraction
    }, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        message: 'Validation error', 
        errors: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}