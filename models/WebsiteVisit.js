import mongoose from 'mongoose';
import { websiteVisitSchema } from '@/lib/validation';

const WebsiteVisitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: ''
  },
  landingPage: {
    type: String,
    required: true
  },
  visitDuration: {
    type: Number, // in seconds
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for common query fields
WebsiteVisitSchema.index({ userId: 1 });
WebsiteVisitSchema.index({ timestamp: -1 });
WebsiteVisitSchema.index({ ipAddress: 1 });

export default mongoose.models.WebsiteVisit || mongoose.model('WebsiteVisit', WebsiteVisitSchema);