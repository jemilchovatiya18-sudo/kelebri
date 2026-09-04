import mongoose, { Document } from 'mongoose';
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
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, mongoose.DefaultSchemaOptions> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProduct>;
export default Product;
//# sourceMappingURL=Product.model.d.ts.map