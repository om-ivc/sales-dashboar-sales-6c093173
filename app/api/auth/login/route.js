import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = loginSchema.parse(body);

    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: validatedData.email }).select('+password');
    if (!user) {
      return Response.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    return Response.json(
      { 
        message: 'Login successful',
        token,
        user: userResponse
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === 'ZodError') {
      return Response.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}