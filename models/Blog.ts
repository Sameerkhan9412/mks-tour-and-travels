import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  image: string;
  category: 'honeymoon' | 'adventure' | 'family' | 'international' | 'visa';
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema<IBlog> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ['honeymoon', 'adventure', 'family', 'international', 'visa'],
      required: true,
    },
    author: { type: String, default: 'MSK Editor' },
  },
  { timestamps: true }
);

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
