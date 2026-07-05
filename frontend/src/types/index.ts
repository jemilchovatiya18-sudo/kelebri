// ── Enums ──────────────────────────────────────────
export type DiamondType = 'LAB_GROWN' | 'NATURAL' | 'MOISSANITE' | 'NONE';
export type MetalType = 'GOLD' | 'WHITE_GOLD' | 'ROSE_GOLD' | 'SILVER' | 'PLATINUM';
export type GoldPurity = 'K14' | 'K18' | 'K22' | 'K24' | 'NONE';
export type Certificate = 'GIA' | 'IGI' | 'SGL' | 'HRD' | 'NONE';
export type CategoryType = 'JEWELRY' | 'DIAMOND';

// ── Models ─────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  imageUrl: string | null;
  publicId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  specifications: string | null;
  categoryId: string;
  category: Category;
  diamondType: DiamondType;
  metalType: MetalType;
  metalColor: string | null;
  goldPurity: GoldPurity;
  diamondWeight: string | null;
  diamondShape: string | null;
  diamondQuality: string | null;
  diamondColor: string | null;
  diamondClarity: string | null;
  stoneType: string | null;
  certificate: Certificate;
  price: number | null;
  showPrice: boolean;
  isAvailable: boolean;
  isSoldOut: boolean;
  isBestSeller: boolean;
  isHeroProduct: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithRelated extends Product {
  related: Product[];
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// ── API Response ───────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminStats {
  total: number;
  bestSellers: number;
  heroProducts: number;
  soldOut: number;
}

// ── Forms ──────────────────────────────────────────
export interface LoginForm {
  email: string;
  password: string;
}

export interface ProductForm {
  name: string;
  sku: string;
  description?: string;
  specifications?: string;
  categoryId: string;
  diamondType: DiamondType;
  metalType: MetalType;
  metalColor?: string;
  goldPurity: GoldPurity;
  diamondWeight?: string;
  diamondShape?: string;
  diamondQuality?: string;
  diamondColor?: string;
  diamondClarity?: string;
  stoneType?: string;
  certificate: Certificate;
  price?: number;
  showPrice: boolean;
  isAvailable: boolean;
  isSoldOut: boolean;
  isBestSeller: boolean;
  isHeroProduct: boolean;
}

// ── Filters ────────────────────────────────────────
export interface ProductFilters {
  category?: string;
  diamondType?: string;
  search?: string;
  bestSeller?: boolean;
  hero?: boolean;
  page?: number;
  limit?: number;
}
