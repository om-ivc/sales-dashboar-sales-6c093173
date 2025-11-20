import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Website visit validation schemas
export const websiteVisitSchema = z.object({
  url: z.string().url('Invalid URL format'),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  timestamp: z.date().optional(),
});

// Newsletter blog validation schemas
export const newsletterBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  publishedAt: z.date().optional(),
  author: z.string().min(1, 'Author is required'),
});

// Email interaction validation schemas
export const emailInteractionSchema = z.object({
  recipient: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  sentAt: z.date().optional(),
  status: z.enum(['sent', 'delivered', 'opened', 'clicked', 'bounced']).default('sent'),
});

// Generic validation function
export const validateData = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
};