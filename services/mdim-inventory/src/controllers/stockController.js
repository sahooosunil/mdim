const Stock = require('../models/stockModel');

async function updateStock(req, res) {
  const { productId, storeId, change } = req.body;
  let stock = await Stock.findOne({ productId, storeId });
  if (!stock) {
    stock = new Stock({ productId, storeId, quantity: 0 });
  }
  stock.quantity += change;
  stock.updatedAt = new Date();
  await stock.save();
  res.json(stock);
}

async function getStock(req, res) {
  const { productId, storeId } = req.query;
  const stock = await Stock.find({ ...(productId && { productId }), ...(storeId && { storeId }) });
  res.json(stock);
}

async function getStockById(req, res) {
  const id = req.params.id;
  const stock = await Stock.findById(id);
  if(!stock) return res.status(404).json({message: "Stock Not found"});
  res.json(stock);
}

async function getStockById(req, res) {
  const id = req.params.id;
  const stock = await Stock.findById(id);
  if(!stock) return res.status(404).json({message: "Stock Not found"});
  res.json(stock);
}

async function deleteStock(req, res) {
  const id = req.params.id;
  await Stock.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
}

module.exports = { updateStock, getStock, getStockById, deleteStock };
