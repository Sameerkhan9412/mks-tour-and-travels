import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  location: string;
  rating: number; // 1-5
  description: string;
  images: string[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema: Schema<IHotel> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 3 },
    description: { type: String, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
  },
  { timestamps: true }
);

const Hotel: Model<IHotel> = mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema);

export default Hotel;
