import { connectToDatabase } from '@/lib/mongodb';
import NewsletterBlog from '@/models/NewsletterBlog';
import { verifyToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

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

    await connectToDatabase();

    const sampleData = [
      {
        title: "10 Tips to Boost Your Sales in Q4",
        author: "Marketing Team",
        publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 500) + 100,
        clicks: Math.floor(Math.random() * 300) + 50,
        conversions: Math.floor(Math.random() * 50) + 5,
        category: "Sales Tips"
      },
      {
        title: "Understanding Customer Behavior in 2024",
        author: "Analytics Department",
        publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 800) + 200,
        clicks: Math.floor(Math.random() * 400) + 100,
        conversions: Math.floor(Math.random() * 80) + 10,
        category: "Analytics"
      },
      {
        title: "New Product Launch: What to Expect",
        author: "Product Team",
        publishDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 1000) + 300,
        clicks: Math.floor(Math.random() * 600) + 150,
        conversions: Math.floor(Math.random() * 100) + 20,
        category: "Product Updates"
      },
      {
        title: "Industry Trends That Will Shape 2025",
        author: "Research Division",
        publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 600) + 150,
        clicks: Math.floor(Math.random() * 350) + 80,
        conversions: Math.floor(Math.random() * 60) + 15,
        category: "Industry Insights"
      },
      {
        title: "How to Optimize Your Email Campaigns",
        author: "Marketing Team",
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 700) + 250,
        clicks: Math.floor(Math.random() * 450) + 120,
        conversions: Math.floor(Math.random() * 70) + 25,
        category: "Marketing"
      }
    ];

    const createdEntries = [];
    for (const data of sampleData) {
      const entry = new NewsletterBlog(data);
      const savedEntry = await entry.save();
      createdEntries.push({
        id: savedEntry._id,
        title: savedEntry.title,
        author: savedEntry.author,
        publishDate: savedEntry.publishDate,
        views: savedEntry.views,
        clicks: savedEntry.clicks,
        conversions: savedEntry.conversions,
        category: savedEntry.category
      });
    }

    return NextResponse.json({
      message: 'Sample newsletter blogs generated successfully',
      data: createdEntries
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating sample newsletter blogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}