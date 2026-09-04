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
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Kelebri API is running ✨', timestamp: new Date() });
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
// Connect to MongoDB, then start server
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        console.log(`\n✨ Kelebri API running on http://localhost:${PORT}`);
        console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map