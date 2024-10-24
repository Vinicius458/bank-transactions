import { Deposit } from "@/domain/usecases";
import { AccountRepository } from "@/data/protocols/db";

export class DepositUseCase implements Deposit {
  constructor(private data: AccountRepository) {}

  async execute(deposit: Deposit.Params): Promise<void> {
    const account = await this.data.findById(deposit.accountId);
    if (!account) throw new Error("Conta não encontrada");

    account.credit(deposit.amount);

    const success = await this.data.updateAccount(account);
    if (!success)
      throw new Error(
        "Erro ao atualizar a conta, possivelmente devido a um conflito de versão"
      );
  }
}
