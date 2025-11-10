const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  storeId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stock', stockSchema);
