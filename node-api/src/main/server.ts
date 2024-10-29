import { setupApp } from "./config/app";
import env from "@/main/config/env";
import "reflect-metadata";
import { TransactionConsumer } from "@/infra/queue/transaction-consumer";
import { makeTransactionQueue } from "./factories/queue/transactionQueueRepository-factory";
import { closeRabbitMQ } from "@/infra/queue/rabbitMQConfig";

const port: number = Number(env.port) || 3000;
const app = setupApp();
async function initializeApp() {
  const transactionQueueRepository = await makeTransactionQueue();
  const trasactionConsumer = new TransactionConsumer(
    transactionQueueRepository
  );
  await trasactionConsumer.startTransactionConsumer();

  console.log("Data Source has been initialized");
  process.on("SIGINT", async () => {
    await closeRabbitMQ();
    process.exit(0);
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
initializeApp();
