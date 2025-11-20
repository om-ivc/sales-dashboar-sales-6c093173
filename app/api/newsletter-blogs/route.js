import { connectToDatabase } from '@/lib/mongodb';
import NewsletterBlog from '@/models/NewsletterBlog';
import { verifyToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const blogs = await NewsletterBlog.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ 
      data: blogs,
      count: blogs.length
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch newsletter blogs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, author, publishedDate, tags } = body;

    if (!title || !content || !author) {
      return NextResponse.json({ error: 'Title, content, and author are required' }, { status: 400 });
    }

    await connectToDatabase();
    const newBlog = new NewsletterBlog({
      title,
      content,
      author,
      publishedDate: publishedDate ? new Date(publishedDate) : new Date(),
      tags: tags || []
    });

    const savedBlog = await newBlog.save();

    return NextResponse.json({ 
      data: savedBlog,
      message: 'Newsletter blog created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create newsletter blog' }, { status: 500 });
  }
}