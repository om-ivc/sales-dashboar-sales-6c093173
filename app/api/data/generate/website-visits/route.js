import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import WebsiteVisit from '@/models/WebsiteVisit';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const existingCount = await WebsiteVisit.countDocuments();
    if (existingCount > 0) {
      return Response.json({ 
        message: 'Sample data already exists', 
        count: existingCount 
      }, { status: 409 });
    }

    const sampleData = [
      {
        url: '/products',
        referrer: 'google.com',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ipAddress: '192.168.1.1',
        timestamp: new Date('2023-05-15T10:30:00Z'),
        userId: decoded.userId
      },
      {
        url: '/pricing',
        referrer: 'twitter.com',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        ipAddress: '192.168.1.2',
        timestamp: new Date('2023-05-15T11:45:00Z'),
        userId: decoded.userId
      },
      {
        url: '/about',
        referrer: 'facebook.com',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        ipAddress: '192.168.1.3',
        timestamp: new Date('2023-05-16T09:15:00Z'),
        userId: decoded.userId
      },
      {
        url: '/contact',
        referrer: 'linkedin.com',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/112.0.1722.58',
        ipAddress: '192.168.1.4',
        timestamp: new Date('2023-05-16T14:20:00Z'),
        userId: decoded.userId
      },
      {
        url: '/blog',
        referrer: 'reddit.com',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        ipAddress: '192.168.1.5',
        timestamp: new Date('2023-05-17T16:10:00Z'),
        userId: decoded.userId
      }
    ];

    const result = await WebsiteVisit.insertMany(sampleData);

    return Response.json({
      message: 'Sample website visits data generated successfully',
      count: result.length,
      data: result
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating sample website visits:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}