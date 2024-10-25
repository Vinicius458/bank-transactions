import { WithDraw } from "@/domain/usecases";
import { AccountRepository, TransactionRepository } from "@/data/protocols/db";
import { Account, TransactionType } from "@/domain/entities";
import { WithdrawUseCase } from "./with-draw";

const makeAccountRepository = (): jest.Mocked<AccountRepository> => ({
  findById: jest.fn(),
  updateAccount: jest.fn(),
});

const makeTransactionRepository = (): jest.Mocked<TransactionRepository> => ({
  saveTransaction: jest.fn(),
});

const makeFakeAccount = (balance: number) => {
  const account = new Account(1232, balance);
  (account.debit = jest.fn().mockImplementation(function (
    this: Account,
    amount: number
  ) {
    this.balance -= amount;
  })),
    (account.credit = jest.fn()),
    (account.incrementVersion = jest.fn()),
    (account.getVersion = jest.fn().mockReturnValue(1));
  return account;
};

describe("WithdrawUseCase", () => {
  let sut: WithDraw;
  let accountRepo: jest.Mocked<AccountRepository>;
  let transactionRepo: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    accountRepo = makeAccountRepository();
    transactionRepo = makeTransactionRepository();
    sut = new WithdrawUseCase(accountRepo, transactionRepo);
  });

  it("Deve lançar erro se o valor do saque for zero ou negativo", async () => {
    const promise = sut.execute({ accountId: 123, amount: -100 });

    await expect(promise).rejects.toThrow("O valor de saque deve ser positivo");
  });

  it("Deve lançar erro se a conta não for encontrada", async () => {
    accountRepo.findById.mockResolvedValueOnce(null);

    const promise = sut.execute({
      accountId: 123,
      amount: 100,
    });

    await expect(promise).rejects.toThrow("Conta não encontrada");
  });

  it("Deve lançar erro se falhar ao atualizar a conta (concorrência)", async () => {
    const fakeAccount = makeFakeAccount(200);
    accountRepo.findById.mockResolvedValueOnce(fakeAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(false);

    const promise = sut.execute({ accountId: 123, amount: 100 });

    await expect(promise).rejects.toThrow(
      "Erro ao atualizar a conta, possivelmente devido a um conflito de versão"
    );
  });

  it("Deve debitar o saldo da conta corretamente em um saque bem-sucedido", async () => {
    const fakeAccount = makeFakeAccount(200);
    accountRepo.findById.mockResolvedValueOnce(fakeAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(true);

    await sut.execute({ accountId: 123, amount: 100 });

    expect(fakeAccount.debit).toHaveBeenCalledWith(100);
    expect(fakeAccount.balance).toBe(100);
  });

  it("Deve salvar a transação após um saque bem-sucedido", async () => {
    const fakeAccount = makeFakeAccount(200);
    accountRepo.findById.mockResolvedValueOnce(fakeAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(true);

    await sut.execute({ accountId: 123, amount: 100 });

    expect(transactionRepo.saveTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 123,
        amount: 100,
        type: TransactionType.WITHDRAW,
      })
    );
  });
});
