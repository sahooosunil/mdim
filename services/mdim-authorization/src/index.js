require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const createRedisClient = require('./config/redis');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Connect DB + Redis
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const redis = createRedisClient(process.env.REDIS_URL);
    await redis.connect();
    app.locals.redis = redis;
    console.log('Redis connected');
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
})();

// routes
app.use('/auth', authRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = 4000;
app.listen(port, () => console.log(`mdim-auth listening on ${port}`));
