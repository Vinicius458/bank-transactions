import { DataSource } from "typeorm";
import { DBTransactionRepository } from "./transaction.repository";
import { Transaction, TransactionType } from "@/domain/entities";
import { Transaction as TransactionEntity } from "./transaction.entity";
import { initializeTestDataSource } from "../config";

let dataSource: DataSource;
let transactionRepository: DBTransactionRepository;

beforeAll(async () => {
  dataSource = await initializeTestDataSource();
  transactionRepository = new DBTransactionRepository(dataSource);
});

afterAll(async () => {
  (await initializeTestDataSource()).destroy();
});

beforeEach(async () => {
  await dataSource.getRepository(TransactionEntity).clear();
});

describe("DBTransactionRepository", () => {
  it("should save a transaction and retrieve it correctly", async () => {
    const transaction = new Transaction(
      1,
      1,
      100.0,
      TransactionType.DEPOSIT,
      2,
      new Date()
    );

    const savedTransaction =
      await transactionRepository.saveTransaction(transaction);

    expect(savedTransaction.id).toBe(transaction.id);
    expect(savedTransaction.accountId).toBe(transaction.accountId);
    expect(savedTransaction.amount).toBe(transaction.amount);
    expect(savedTransaction.type).toBe(transaction.type);
    expect(savedTransaction.targetAccountId).toBe(transaction.targetAccountId);
  });
});
