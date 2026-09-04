import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const getProducts: (req: Request, res: Response) => Promise<void>;
export declare const getProductById: (req: Request, res: Response) => Promise<void>;
export declare const getProductBySlug: (req: Request, res: Response) => Promise<void>;
export declare const createProduct: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProduct: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProduct: (req: AuthRequest, res: Response) => Promise<void>;
export declare const toggleProductFlag: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addProductImage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProductImage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAdminStats: (_req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=product.controller.d.ts.map