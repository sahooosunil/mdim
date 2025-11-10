const mongoose = require('mongoose');
const logger = require("../config/logger");

async function connectDB(uri) {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  logger.info('MongoDB connected');
}

module.exports = connectDB;
