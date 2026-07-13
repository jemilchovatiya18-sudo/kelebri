import mongoose, { Document, Schema } from 'mongoose';

export type CategoryType = 'JEWELRY' | 'DIAMOND' | 'CUSTOM';

export interface ICategory extends Document {
  name: string;
  slug: string;
  type: CategoryType;
  imageUrl?: string;
  publicId?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['JEWELRY', 'DIAMOND', 'CUSTOM'],
      default: 'JEWELRY',
    },
    imageUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
