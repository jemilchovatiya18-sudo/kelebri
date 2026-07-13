import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description?: string;
  specifications?: string;
  categoryId: mongoose.Types.ObjectId;
  diamondType?: string;
  metalType?: string;
  metalColor?: string;
  goldPurity?: string;
  diamondWeight?: string;
  diamondShape?: string;
  diamondQuality?: string;
  diamondColor?: string;
  diamondClarity?: string;
  stoneType?: string;
  certificate?: string;
  price?: number;
  showPrice: boolean;
  isAvailable: boolean;
  isSoldOut: boolean;
  isBestSeller: boolean;
  isHeroProduct: boolean;
  images: IProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    _id: true,
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

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    specifications: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    diamondType: { type: String },
    metalType: { type: String },
    metalColor: { type: String },
    goldPurity: { type: String },
    diamondWeight: { type: String },
    diamondShape: { type: String },
    diamondQuality: { type: String },
    diamondColor: { type: String },
    diamondClarity: { type: String },
    stoneType: { type: String },
    certificate: { type: String },
    price: { type: Number },
    showPrice: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    isSoldOut: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isHeroProduct: { type: Boolean, default: false },
    images: { type: [ProductImageSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        // Expose categoryId as plain string ID if it's an ObjectId (not populated)
        if (ret.categoryId && typeof ret.categoryId === 'object' && (ret.categoryId._id || ret.categoryId.id)) {
          // populated: keep the category object but also expose its id
          ret.category = ret.categoryId;
          ret.categoryId = (ret.categoryId._id || ret.categoryId.id).toString();
        } else if (ret.categoryId) {
          ret.categoryId = ret.categoryId.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Text index for search
ProductSchema.index({ name: 'text', sku: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
