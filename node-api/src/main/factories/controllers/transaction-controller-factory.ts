import { TransactionQueueRepositoryImpl } from "@/infra/queue/transactionQueueRepositoryImpl";
import { makeTransfer, makeDeposit, makeWithdraw } from "@/main/factories";
import { TransactionController } from "@/presentation/controllers/transaction-controller";
import { Controller } from "@/presentation/protocols";
import { makeTransactionValidation } from "./transaction-validation-factory";

export const makeTransactionController = async (): Promise<Controller> => {
  const controller = new TransactionController(
    makeTransactionValidation(),
    new TransactionQueueRepositoryImpl()
  );
  return controller;
};
