// src/index.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const startConsumer = require('./consumers/salesReturnConsumer');
const connectDB = require('./config/db')
const logger = require("./config/logger");


const app = express();
app.use(express.json());
app.use(morgan('dev'));

(async () => {
    try {
      await connectDB(process.env.MONGO_URI);
    } catch (err) {
      logger.error('Startup error', err)
      process.exit(1);
    }
  })();

app.use("/api/products", productRoutes);
app.use("/api/stocks", stockRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));
// Start Kafka consumer
startConsumer();

const PORT = 4001;
app.listen(PORT, () => logger.info(`Inventory service running on port ${PORT}`));
