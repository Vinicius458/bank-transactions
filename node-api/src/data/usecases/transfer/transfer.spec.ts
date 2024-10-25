import { AccountRepository, TransactionRepository } from "@/data/protocols/db";
import { TransactionType } from "@/domain/entities";
import { Account } from "@/domain/entities";
import { TransferUseCase } from "./transfer";

describe("TransferUseCase", () => {
  const makeAccountRepository = (): jest.Mocked<AccountRepository> => ({
    findById: jest.fn(),
    updateAccount: jest.fn(),
  });

  const makeTransactionRepository = (): jest.Mocked<TransactionRepository> => ({
    saveTransaction: jest.fn(),
  });

  const makeFakeAccount = (id: number, balance: number) => {
    const account = new Account(id, balance);
    (account.debit = jest.fn().mockImplementation(function (
      this: Account,
      amount: number
    ) {
      this.balance -= amount;
    })),
      (account.credit = jest.fn().mockImplementation(function (
        this: Account,
        amount: number
      ) {
        this.balance += amount;
      })),
      (account.credit = jest.fn()),
      (account.incrementVersion = jest.fn()),
      (account.getVersion = jest.fn().mockReturnValue(1));
    return account;
  };
  const makeSut = () => {
    const accountRepo = makeAccountRepository();
    const transactionRepo = makeTransactionRepository();
    const sut = new TransferUseCase(accountRepo, transactionRepo);
    return { sut, accountRepo, transactionRepo };
  };

  it("should correctly transfer the amount between accounts", async () => {
    const { sut, accountRepo, transactionRepo } = makeSut();
    const sourceAccount = makeFakeAccount(1, 1000);
    const targetAccount = makeFakeAccount(2, 500);

    accountRepo.findById.mockResolvedValueOnce(sourceAccount);
    accountRepo.findById.mockResolvedValueOnce(targetAccount);
    accountRepo.updateAccount.mockResolvedValue(true);
    transactionRepo.saveTransaction.mockResolvedValue();

    await sut.execute({
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: 100,
    });

    expect(sourceAccount.debit).toHaveBeenCalledWith(100);
    expect(targetAccount.credit).toHaveBeenCalledWith(100);
    expect(accountRepo.updateAccount).toHaveBeenCalledWith(sourceAccount);
    expect(accountRepo.updateAccount).toHaveBeenCalledWith(targetAccount);
    expect(transactionRepo.saveTransaction).toHaveBeenCalledTimes(2);
    expect(transactionRepo.saveTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 1,
        amount: 100,
        type: TransactionType.WITHDRAW,
      })
    );
    expect(transactionRepo.saveTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 2,
        amount: 100,
        type: TransactionType.DEPOSIT,
      })
    );
  });

  it("should throw error if source account not found", async () => {
    const { sut, accountRepo } = makeSut();
    accountRepo.findById.mockResolvedValueOnce(null);

    await expect(
      sut.execute({
        sourceAccountId: 1,
        targetAccountId: 2,
        amount: 100,
      })
    ).rejects.toThrow("Conta de origem não encontrada");
  });

  it("should throw error if target account is not found", async () => {
    const { sut, accountRepo } = makeSut();
    const sourceAccount = makeFakeAccount(1, 1000);

    accountRepo.findById.mockResolvedValueOnce(sourceAccount);
    accountRepo.findById.mockResolvedValueOnce(null);

    await expect(
      sut.execute({
        sourceAccountId: 1,
        targetAccountId: 2,
        amount: 100,
      })
    ).rejects.toThrow("Conta de destino não encontrada");
  });

  it("It should throw an error if it fails to update one of the accounts", async () => {
    const { sut, accountRepo } = makeSut();
    const sourceAccount = makeFakeAccount(1, 1000);
    const targetAccount = makeFakeAccount(2, 500);

    accountRepo.findById.mockResolvedValueOnce(sourceAccount);
    accountRepo.findById.mockResolvedValueOnce(targetAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(true);
    accountRepo.updateAccount.mockResolvedValueOnce(false);

    await expect(
      sut.execute({
        sourceAccountId: 1,
        targetAccountId: 2,
        amount: 100,
      })
    ).rejects.toThrow("Erro ao atualizar as contas");
  });
});
