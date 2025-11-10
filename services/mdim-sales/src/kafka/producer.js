const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "mdim-sales-service", // A unique ID for your application
  brokers: [process.env.KAFKA_BROKER], // Replace with your Kafka broker addresses
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("Kafka producer connected");
}
connectProducer();
const sendSaleEvent = async (sale) => {
  try {
    await producer.send({
      topic: "mdim-sales-topic",
      messages: [
        {
          value: JSON.stringify({
            event: "SALE_CREATED",
            data: sale,
          }),
        },
      ],
    });
    console.log(`Message sent to topic "${topic}": ${messageValue}`);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

//Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('Disconnecting Kafka producer...');
    await producer.disconnect();
    process.exit(0);
  });

module.exports = sendSaleEvent;
