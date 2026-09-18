import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  slug: string;
  image: string;
  overview: string;
  attractions: string[];
  activities: string[];
  bestTimeToVisit: string;
  travelTips: string[];
  isDomestic: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema: Schema<IDestination> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, required: true },
    overview: { type: String, required: true },
    attractions: [{ type: String }],
    activities: [{ type: String }],
    bestTimeToVisit: { type: String, required: true },
    travelTips: [{ type: String }],
    isDomestic: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Destination: Model<IDestination> =
  mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);

export default Destination;
