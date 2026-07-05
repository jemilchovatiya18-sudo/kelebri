import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const getCategories: (_req: Request, res: Response) => Promise<void>;
export declare const getCategoryBySlug: (req: Request, res: Response) => Promise<void>;
export declare const createCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCategory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCategory: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=category.controller.d.ts.map