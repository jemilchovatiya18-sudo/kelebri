import { Router } from 'express';
import { upload, uploadImage, deleteImage } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, upload.single('image'), uploadImage);
router.delete('/:publicId', authenticate, deleteImage);

export default router;
