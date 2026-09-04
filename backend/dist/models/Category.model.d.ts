import mongoose, { Document } from 'mongoose';
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
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, mongoose.DefaultSchemaOptions> & ICategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICategory>;
export default Category;
//# sourceMappingURL=Category.model.d.ts.map