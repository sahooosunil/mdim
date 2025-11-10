const Sale = require("../models/salesModel");
const logger = require("../config/logger");
const sendSaleEvent  = require("../kafka/producer");

exports.createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    logger.info(`New sale created: ${sale.saleId}`);

    // publish event to Kafka
    await sendSaleEvent(sale);
   

    res.status(201).json(sale);
  } catch (err) {
    logger.error("Error creating sale", err);
    res.status(500).json({ message: "Error creating sale", error: err.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (err) {
    logger.error("Error fetching sales", err);
    res.status(500).json({ message: "Error fetching sales", error: err.message });
  }
};
