import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import EmailInteraction from '@/models/EmailInteraction';
import { NextResponse } from 'next/server';

const emailTypes = ['newsletter', 'promotion', 'transactional'];
const actions = ['open', 'click', 'bounce', 'spam'];
const campaigns = ['Summer Sale', 'Product Launch', 'Weekly Newsletter', 'Holiday Special'];
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];

function getRandomDate() {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomEmail() {
  const name = Math.random().toString(36).substring(2, 10);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name}@${domain}`;
}

function generateEmailInteractionData(count) {
  return Array.from({ length: count }, (_, i) => ({
    email: generateRandomEmail(),
    campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
    type: emailTypes[Math.floor(Math.random() * emailTypes.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    timestamp: getRandomDate(),
    userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 10000)} Safari/537.36`,
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  }));
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const data = await request.json();
    const count = Math.min(data.count || 10, 100);

    const interactions = generateEmailInteractionData(count);
    const result = await EmailInteraction.insertMany(interactions);

    return NextResponse.json({
      message: `Successfully generated ${result.length} email interactions`,
      data: result
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating email interactions:', error);
    return NextResponse.json({ error: 'Failed to generate email interactions' }, { status: 500 });
  }
}