import { Response } from 'express';
import multer from 'multer';
import cloudinary from '../lib/cloudinary';
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
    console.log('📤 Upload request received');
    console.log('📤 User:', req.user?.id);
    console.log('📤 File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'NO FILE');
    
    if (!req.file) {
      console.log('❌ No file in request');
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary not configured. Please add credentials to .env file');
      res.status(500).json({ 
        success: false, 
        message: 'Image upload service not configured. Please contact administrator.' 
      });
      return;
    }

    console.log('✅ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);

    const folder = (req.body.folder as string) || 'kelebri/products';
    console.log('📁 Uploading to folder:', folder);

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
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload success:', result?.secure_url);
            resolve(result);
          }
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
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    const errorMessage = error?.message || 'Upload failed';
    res.status(500).json({ success: false, message: errorMessage });
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
