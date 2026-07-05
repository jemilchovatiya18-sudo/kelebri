"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
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
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }
        const folder = req.body.folder || 'kelebri/products';
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                transformation: [
                    { quality: 'auto:best', fetch_format: 'auto' },
                    { width: 1200, height: 1200, crop: 'limit' },
                ],
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
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
        console.error(error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
};
exports.uploadImage = uploadImage;
const deleteImage = async (req, res) => {
    try {
        const publicId = decodeURIComponent(String(req.params.publicId));
        await cloudinary_1.v2.uploader.destroy(publicId);
        res.json({ success: true, message: 'Image deleted from Cloudinary' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
};
exports.deleteImage = deleteImage;
//# sourceMappingURL=upload.controller.js.map