import { Deposit } from "@/domain/usecases";
import { AccountRepository } from "@/data/protocols/db";

export class DepositUseCase implements Deposit {
  constructor(private accountRepo: AccountRepository) {}

  async execute(data: Deposit.Params): Promise<void> {
    const account = await this.accountRepo.findById(data.accountId);
    if (!account) throw new Error("Conta não encontrada");

    account.credit(data.amount);

    const success = await this.accountRepo.updateAccount(account);
    if (!success)
      throw new Error(
        "Erro ao atualizar a conta, possivelmente devido a um conflito de versão"
      );
  }
}
