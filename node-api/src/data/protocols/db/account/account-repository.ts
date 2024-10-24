import { Account } from "@/domain/entities";

export interface AccountRepository {
  findById(accountId: number): Promise<Account | null>;
  updateAccount(account: Account): Promise<boolean>;
}
