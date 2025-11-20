import mongoose from 'mongoose';
import { newsletterBlogSchema } from '@/lib/validation';

const NewsletterBlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publishedAt: {
    type: Date,
    required: true
  },
  readTime: {
    type: Number,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add indexes for common query fields
NewsletterBlogSchema.index({ publishedAt: -1 });
NewsletterBlogSchema.index({ slug: 1 });
NewsletterBlogSchema.index({ category: 1 });
NewsletterBlogSchema.index({ tags: 1 });

// Validate data before saving
NewsletterBlogSchema.pre('save', function(next) {
  const data = this.toObject();
  delete data._id;
  delete data.__v;
  delete data.createdAt;
  delete data.updatedAt;

  const validationResult = newsletterBlogSchema.safeParse(data);
  if (!validationResult.success) {
    const error = new Error('Newsletter blog validation failed');
    error.validationErrors = validationResult.error.flatten();
    next(error);
  } else {
    next();
  }
});

export default mongoose.models.NewsletterBlog || mongoose.model('NewsletterBlog', NewsletterBlogSchema);