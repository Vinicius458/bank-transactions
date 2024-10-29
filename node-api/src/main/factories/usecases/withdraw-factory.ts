import { WithDraw } from "@/domain/usecases";
import { WithdrawUseCase } from "@/data/usecases";
import { DBAccountRepository } from "@/infra/db/sql/account/account.repository";
import { DBTransactionRepository } from "@/infra/db/sql/transaction/transaction.repository";
import { initializeTestDataSource } from "@/infra/db/sql/config";
import { DataSource } from "typeorm";

export const makeWithdraw = async (): Promise<WithDraw> => {
  let dataSource: DataSource = await initializeTestDataSource();
  const accountRepository = new DBAccountRepository(dataSource);
  const transactionRepository = new DBTransactionRepository(dataSource);
  return new WithdrawUseCase(accountRepository, transactionRepository);
};