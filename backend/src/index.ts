import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB, getDbStatus } from './lib/db';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & logging
app.use(helmet());
app.use(morgan('dev'));

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, postman, curl)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await connectDB();
  } catch {
    // connection errors are reported via getDbStatus below
  }

  const db = getDbStatus();

  res.status(db.connected ? 200 : 503).json({
    success: db.connected,
    message: db.connected ? 'Kelebri API is running ✨' : 'Kelebri API is running but database is unavailable',
    timestamp: new Date(),
    database: db,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Trigger MongoDB connection non-blockingly
connectDB().catch((err) => console.warn('DB connect warning:', err));

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n✨ Kelebri API running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

export default app;
