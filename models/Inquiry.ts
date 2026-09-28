import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  destination?: string;
  category?: string;
  packageName?: string;
  packageSlug?: string;
  travelDate?: string; // e.g. "2026-07-15"
  budget?: number;
  travelersCount?: number;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  notes: string;
  inquiryType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema<IInquiry> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    destination: { type: String, default: '', trim: true },
    category: { type: String, default: '', trim: true },
    packageName: { type: String, default: '', trim: true },
    packageSlug: { type: String, default: '', trim: true },
    travelDate: { type: String, default: '' },
    budget: { type: Number, default: 0, min: 0 },
    travelersCount: { type: Number, default: 1, min: 1 },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
    notes: { type: String, default: '' },
    inquiryType: { type: String, default: 'quote' },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
