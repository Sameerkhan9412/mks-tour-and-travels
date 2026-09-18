import mongoose, { Schema, Document, Model } from 'mongoose';
import Destination from './Destination';
import Hotel from './Hotel';
import Category from './Category';

// Prevent Next.js bundler tree-shaking for these schemas
const _registerDestination = Destination.modelName;
const _registerHotel = Hotel.modelName;
const _registerCategory = Category.modelName;

export interface IItineraryItem {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

export interface IPlaceYouWillSee {
  name: string;
  image: string;
}

export interface IPackageHighlights {
  travel?: string; // e.g. "04 Days/ 03 Nights"
  accommodation?: string; // e.g. "3 nights in hotels"
  meals?: string; // e.g. "4 Breakfasts, 3 Dinners"
  transport?: string; // e.g. "Mini-Coach and Ferry" or "Private Cab"
  groupSize?: string; // e.g. "Average 24 people" or "Private"
  team?: string; // e.g. "Expert Trip Manager"
}

export interface IPackage extends Document {
  name: string;
  slug: string;
  destination?: mongoose.Types.ObjectId;
  description: string;
  duration: string; // e.g. "4 Days / 3 Nights"
  durationDays: number; // e.g. 4
  price: number; // Current/Discounted price e.g. 18000
  regularPrice?: number; // Crossed out original price e.g. 22000
  rating: number;
  images: string[];
  highlights?: IPackageHighlights;
  placesYouWillSee?: IPlaceYouWillSee[];
  itineraryIntro?: string;
  itinerary: IItineraryItem[];
  included: string[];
  excluded: string[];
  hotels: mongoose.Types.ObjectId[];
  featured: boolean;
  category: string; // e.g. "kashmir", "uttarakhand", "himachal-pradesh", etc.
  categoryRef?: mongoose.Types.ObjectId;
  mapUrl?: string;
  mapEmbedUrl?: string;
  isDomestic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ItineraryItemSchema = new Schema<IItineraryItem>({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  activities: [{ type: String }],
});

const PlaceYouWillSeeSchema = new Schema<IPlaceYouWillSee>({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const HighlightsSchema = new Schema<IPackageHighlights>({
  travel: { type: String, default: '' },
  accommodation: { type: String, default: '' },
  meals: { type: String, default: '' },
  transport: { type: String, default: '' },
  groupSize: { type: String, default: '' },
  team: { type: String, default: '' },
});

const PackageSchema: Schema<IPackage> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    destination: { type: Schema.Types.ObjectId, ref: 'Destination' },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    durationDays: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    regularPrice: { type: Number, min: 0 },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    images: [{ type: String, required: true }],
    highlights: { type: HighlightsSchema, default: () => ({}) },
    placesYouWillSee: [PlaceYouWillSeeSchema],
    itineraryIntro: { type: String, default: '' },
    itinerary: [ItineraryItemSchema],
    included: [{ type: String }],
    excluded: [{ type: String }],
    hotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
    featured: { type: Boolean, default: false },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    categoryRef: { type: Schema.Types.ObjectId, ref: 'Category' },
    mapUrl: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    isDomestic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Package: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;
