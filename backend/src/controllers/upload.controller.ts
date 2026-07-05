import { Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { AuthRequest } from '../middleware/auth.middleware';

// Memory storage — upload buffer to Cloudinary directly
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const folder = (req.body.folder as string) || 'kelebri/products';

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            { quality: 'auto:best', fetch_format: 'auto' },
            { width: 1200, height: 1200, crop: 'limit' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const publicId = decodeURIComponent(String(req.params.publicId));
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted from Cloudinary' });
  } catch {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};
