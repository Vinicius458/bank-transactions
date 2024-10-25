import { Transaction } from "@/domain/entities";

export interface TransactionRepository {
  saveTransaction(transaction: Transaction): Promise<void>;
}
