import { AccountRepository, TransactionRepository } from "@/data/protocols/db";
import { Transaction, TransactionType } from "@/domain/entities";
import { Transfer } from "@/domain/usecases";

export class TransferUseCase implements Transfer {
  constructor(
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository
  ) {}

  async execute(data: Transfer.Params): Promise<void> {
    const sourceAccount = await this.accountRepo.findById(data.sourceAccountId);
    if (!sourceAccount) throw new Error("Conta de origem não encontrada");

    const targetAccount = await this.accountRepo.findById(data.targetAccountId);
    if (!targetAccount) throw new Error("Conta de destino não encontrada");

    sourceAccount.debit(data.amount);

    targetAccount.credit(data.amount);

    const sourceTransaction = new Transaction(
      Date.now(),
      data.sourceAccountId,
      data.amount,
      TransactionType.WITHDRAW,
      data.targetAccountId
    );

    const targetTransaction = new Transaction(
      Date.now(),
      data.targetAccountId,
      data.amount,
      TransactionType.DEPOSIT,
      data.sourceAccountId
    );

    const successSource = await this.accountRepo.updateAccount(sourceAccount);
    const successTarget = await this.accountRepo.updateAccount(targetAccount);

    if (!successSource || !successTarget)
      throw new Error("Erro ao atualizar as contas");

    await this.transactionRepo.saveTransaction(sourceTransaction);
    await this.transactionRepo.saveTransaction(targetTransaction);
  }
}
