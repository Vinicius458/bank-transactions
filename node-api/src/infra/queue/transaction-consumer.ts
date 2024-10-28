import { ProcessTransaction } from "@/data/usecases";
import { TransactionQueueRepository } from "@/data/protocols/queue/transaction-queue-repository";
import { TransactionQueueRepositoryImpl } from "@/infra/queue/transactionQueueRepositoryImpl";
import { TransactionType } from "@/domain/entities";
import { makeDeposit, makeTransfer, makeWithdraw } from "@/main/factories";

export async function startTransactionConsumer() {
  const transactionQueueRepo: TransactionQueueRepository =
    new TransactionQueueRepositoryImpl();
  const [transfer, deposit, withdraw] = await Promise.all([
    makeTransfer(),
    makeDeposit(),
    makeWithdraw(),
  ]);
  let processTransaction: ProcessTransaction;

  transactionQueueRepo.consume(async (transaction) => {
    switch (transaction.type) {
      case TransactionType.DEPOSIT:
        processTransaction = new ProcessTransaction(deposit);
        break;
      case TransactionType.WITHDRAW:
        processTransaction = new ProcessTransaction(withdraw);
        break;
      case TransactionType.TRANSFER:
        processTransaction = new ProcessTransaction(transfer);

        break;
    }
    await processTransaction.execute(transaction);
  });
}
