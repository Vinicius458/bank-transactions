import { Channel } from "amqplib";
import { Transaction } from "@/domain/entities";
import { TransactionQueueRepository } from "@/data/protocols/queue/transaction-queue-repository";
import { createRabbitMQChannel } from "./rabbitMQConfig";

export class TransactionQueueRepositoryImpl
  implements TransactionQueueRepository
{
  private channel: Channel;

  constructor() {
    this.init();
  }

  private async init() {
    this.channel = await createRabbitMQChannel();
    await this.channel.assertQueue("transactionQueue");
  }

  async enqueue(transaction: Transaction): Promise<void> {
    const message = JSON.stringify(transaction);
    this.channel.sendToQueue("transactionQueue", Buffer.from(message));
  }

  async consume(
    callback: (transaction: Transaction) => Promise<void>
  ): Promise<void> {
    this.channel.consume("transactionQueue", async (msg) => {
      if (msg) {
        const transaction: Transaction = JSON.parse(msg.content.toString());
        try {
          await callback(transaction);
          this.channel.ack(msg);
        } catch (error) {
          console.error("Erro ao processar transação:", error);
          this.channel.nack(msg, false, true);
        }
      }
    });
  }
}
