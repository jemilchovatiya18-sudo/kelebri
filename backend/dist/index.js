"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./lib/db");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security & logging
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// CORS
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, postman, curl)
        if (!origin)
            return callback(null, true);
        return callback(null, true);
    },
    credentials: true,
}));
// Body parsers
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check
app.get('/api/health', async (_req, res) => {
    let dbConnected = false;
    let dbError = null;
    try {
        await (0, db_1.connectDB)();
        dbConnected = mongoose_1.default.connection.readyState === 1;
    }
    catch (error) {
        dbError = error.message;
    }
    const db = (0, db_1.getDbStatus)();
    res.status(dbConnected ? 200 : 503).json({
        success: dbConnected,
        message: dbConnected
            ? 'Kelebri API is running ✨'
            : 'Kelebri API is running but database is unavailable',
        timestamp: new Date(),
        database: {
            ...db,
            error: dbError || undefined,
        },
    });
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
// 404
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
// Error handler
app.use(errorHandler_1.errorHandler);
// Trigger MongoDB connection non-blockingly (pre-warm for Vercel)
if (process.env.VERCEL) {
    (0, db_1.connectDB)().catch((err) => console.error('❌ DB connection failed:', err));
}
else {
    (0, db_1.connectDB)().catch((err) => console.warn('DB connect warning:', err));
}
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`\n✨ Kelebri API running on http://localhost:${PORT}`);
        console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map