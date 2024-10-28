import amqp from "amqplib";

export async function createRabbitMQChannel() {
  const connection = await amqp.connect("amqp://localhost");
  return connection.createChannel();
}
