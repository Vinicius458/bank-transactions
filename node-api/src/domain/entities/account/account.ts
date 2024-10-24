export class Account {
  constructor(
    public readonly id: number,
    public balance: number,
    private version: number = 1
  ) {}

  credit(amount: number): void {
    if (amount <= 0) throw new Error("O valor do depósito deve ser positivo");
    this.balance += amount;
  }

  debit(amount: number): void {
    if (amount <= 0) throw new Error("O valor do saque deve ser positivo");
    if (this.balance < amount) throw new Error("Saldo insuficiente");
    this.balance -= amount;
  }

  incrementVersion(): void {
    this.version += 1;
  }

  getVersion(): number {
    return this.version;
  }
}
