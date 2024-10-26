export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  TRANSFER = "TRANSFER",
}

export class Transaction {
  constructor(
    public readonly id: number,
    public readonly accountId: number,
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly targetAccountId?: number,
    public readonly createdAt: Date = new Date()
  ) {}
}
