import { Response } from 'express';
import multer from 'multer';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const upload: multer.Multer;
export declare const uploadImage: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteImage: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=upload.controller.d.ts.map