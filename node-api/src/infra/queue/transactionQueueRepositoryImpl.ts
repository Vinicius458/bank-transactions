import { Channel } from "amqplib";
import { Transaction } from "@/domain/entities";
import { TransactionQueueRepository } from "@/data/protocols/queue/transaction-queue-repository";
import { createRabbitMQChannel } from "./rabbitMQConfig";

export class TransactionQueueRepositoryImpl
  implements TransactionQueueRepository
{
  private channel: Channel;
  private queueName = "transactions";

  constructor(channel: Channel) {
    this.channel = channel;
  }

  async enqueue(transaction: Transaction): Promise<void> {
    await this.channel.assertQueue(this.queueName, { durable: true });
    const message = JSON.stringify(transaction);
    this.channel.sendToQueue(this.queueName, Buffer.from(message));
  }

  async consume(
    callback: (transaction: Transaction) => Promise<void>
  ): Promise<void> {
    await this.channel.assertQueue(this.queueName, { durable: true });
    this.channel.consume(this.queueName, async (msg) => {
      if (msg) {
        const transactionData: Transaction = JSON.parse(msg.content.toString());
        const transaction = new Transaction(
          transactionData.accountId,
          transactionData.amount,
          transactionData.type,
          transactionData.targetAccountId
        );
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
