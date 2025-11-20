import mongoose from 'mongoose';

const emailInteractionSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'opened', 'clicked', 'bounced'],
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  campaign: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.EmailInteraction || mongoose.model('EmailInteraction', emailInteractionSchema);