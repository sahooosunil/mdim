const Product = require('../models/productModel');
const logger = require("../config/logger");

async function createProduct(req, res) {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
}

async function getAllProducts(req, res) {
  const products = await Product.find();
  res.json(products);
}

async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
}

async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
}

async function deleteProduct(req, res) {
  await Product.findByIdAndDelete(req.params.id);
  logger.info(`Product deleted successfully with id ${req.params.id}`);
  res.json({ message: 'Deleted' });
}

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
