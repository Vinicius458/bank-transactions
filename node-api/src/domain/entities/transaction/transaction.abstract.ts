export abstract class Transaction {
  constructor(
    public accountId: number,
    public amount: number
  ) {}

  abstract execute(): Promise<void>;
}
