import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { userRegistrationSchema } from '@/lib/validation';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = userRegistrationSchema.parse(body);

    const { name, email, password } = validatedData;

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Return success response without password
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return Response.json(
      { 
        message: 'User registered successfully', 
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return Response.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Handle other errors
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}