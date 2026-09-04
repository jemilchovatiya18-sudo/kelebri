"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
// Memory storage — upload buffer to Cloudinary directly
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
const uploadImage = async (req, res) => {
    try {
        console.log('📤 Upload request received');
        console.log('📤 Admin:', req.adminId);
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
        const folder = req.body.folder || 'kelebri/products';
        console.log('📁 Uploading to folder:', folder);
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({
                folder,
                transformation: [
                    { quality: 'auto:best', fetch_format: 'auto' },
                    { width: 1200, height: 1200, crop: 'limit' },
                ],
            }, (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload error:', error);
                    reject(error);
                }
                else {
                    console.log('✅ Cloudinary upload success:', result?.secure_url);
                    resolve(result);
                }
            });
            stream.end(req.file.buffer);
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
    }
    catch (error) {
        console.error('❌ Upload error:', error);
        const errorMessage = error?.message || 'Upload failed';
        res.status(500).json({ success: false, message: errorMessage });
    }
};
exports.uploadImage = uploadImage;
const deleteImage = async (req, res) => {
    try {
        const publicId = decodeURIComponent(String(req.params.publicId));
        await cloudinary_1.default.uploader.destroy(publicId);
        res.json({ success: true, message: 'Image deleted from Cloudinary' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
};
exports.deleteImage = deleteImage;
//# sourceMappingURL=upload.controller.js.map