import dotenv from "dotenv";
dotenv.config(); // ✅ load .env variables


import express from 'express';
import morgan from 'morgan';
import connectDB from "./config/db.js";

import { createRedisClient } from './config/redis.js';
import authRoutes from './routes/authRoutes.js';
import Role from './models/rolesModel.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// ✅ Connect MongoDB and Redis
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const redis = createRedisClient(process.env.REDIS_URL);
    await redis.connect();

    app.locals.redis = redis;
    console.log('✅ Redis connected');
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();

// ✅ Routes
app.use('/auth', authRoutes);

// ✅ Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ✅ Global error handler
app.use(globalErrorHandler);

// ✅ Start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 mdim-auth listening on port ${port}`));
