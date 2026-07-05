export declare let admins: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}[];
export declare let categories: {
    id: string;
    name: string;
    slug: string;
    type: string;
    imageUrl: string;
    publicId: string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}[];
export declare let products: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    specifications: string;
    categoryId: string;
    diamondType: string;
    metalType: string;
    metalColor: string;
    goldPurity: string;
    diamondWeight: string;
    diamondShape: string;
    diamondQuality: string;
    diamondColor: string;
    diamondClarity: string;
    stoneType: string;
    certificate: string;
    price: number;
    showPrice: boolean;
    isAvailable: boolean;
    isSoldOut: boolean;
    isBestSeller: boolean;
    isHeroProduct: boolean;
    createdAt: Date;
    updatedAt: Date;
    images: {
        id: string;
        productId: string;
        url: string;
        publicId: string;
        isPrimary: boolean;
        sortOrder: number;
        createdAt: Date;
    }[];
}[];
export declare const generateId: () => string;
//# sourceMappingURL=mockData.d.ts.map