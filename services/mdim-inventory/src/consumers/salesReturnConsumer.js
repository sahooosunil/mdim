const { Kafka } = require('kafkajs');
const Stock = require('../models/stockModel');
const logger = require("../config/logger");

async function startConsumer() {
  const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
  const consumer = kafka.consumer({ groupId: 'inventory-service' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'mdim-sales-topic', fromBeginning: false });
  await consumer.subscribe({ topic: 'mdim-returns-topic', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      logger.info(`Kafka message received to topic ${topic} and message is ${JSON.parse(message)}`);
      const data = JSON.parse(message.value.toString());
      if (topic === 'mdim-sales-topic') {
        await Stock.updateOne(
          { productId: data.productId, storeId: data.storeId },
          { $inc: { quantity: -data.quantity }, $set: { updatedAt: new Date() } },
          { upsert: true }
        );
      }
      if (topic === 'mdim-returns-events') {
        await Stock.updateOne(
          { productId: data.productId, storeId: data.storeId },
          { $inc: { quantity: data.quantity }, $set: { updatedAt: new Date() } },
          { upsert: true }
        );
      }
      console.log(`Processed event from ${topic}`);
    }
  });
}

module.exports = startConsumer;
