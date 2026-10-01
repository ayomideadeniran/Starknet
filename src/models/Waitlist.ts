import mongoose, { Schema, Model } from 'mongoose';

export interface IWaitlistDocument {
  fullName: string;
  email: string;
  phone: string;
  phonePrefix?: string;
  phoneNumber?: string;
  country: string;
  investmentTier: string;
  paymentMethod: string;
  investorType: string;
  primaryInterest: string;
  telegramHandle?: string;
  referralCode?: string;
  notes?: string;
  termsAgreed?: boolean;
  ticketId: string;
  queueNumber: number;
  priorityStatus: 'VIP' | 'Institutional' | 'Standard';
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistSchema = new Schema<IWaitlistDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    phonePrefix: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    investmentTier: { type: String, required: true, default: '$10,000 – $50,000' },
    paymentMethod: { type: String, required: true, default: 'USDT / USDC (Stablecoins)' },
    investorType: { type: String, required: true, default: 'Individual / Private Investor ($200+ Starter)' },
    primaryInterest: { type: String, required: true, default: 'Starknet Bitcoin ZK-Vault & 30% – 50% Monthly Yield' },
    telegramHandle: { type: String, trim: true },
    referralCode: { type: String, trim: true },
    notes: { type: String, trim: true },
    termsAgreed: { type: Boolean, default: true },
    ticketId: { type: String, required: true, unique: true },
    queueNumber: { type: Number, required: true },
    priorityStatus: {
      type: String,
      enum: ['VIP', 'Institutional', 'Standard'],
      default: 'VIP',
    },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
    strict: false, // Ensures all inputs and any extra fields are preserved in MongoDB
    collection: 'registrations', // Explicitly saves to the 'registrations' collection in MongoDB
  }
);

// Helpful indexes
WaitlistSchema.index({ queueNumber: 1 });

export const WaitlistModel: Model<IWaitlistDocument> =
  mongoose.models.Waitlist ||
  mongoose.models.Registration ||
  mongoose.model<IWaitlistDocument>('Registration', WaitlistSchema, 'registrations');

export const RegistrationModel = WaitlistModel;
