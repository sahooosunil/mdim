const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    saleId: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    storeId: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    soldBy: { type: String, required: true },
    customerName: { type: String },
    paymentMethod: { type: String, enum: ["CASH", "CARD", "ONLINE"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
