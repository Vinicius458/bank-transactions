export interface AddAccount {
  add: (account: Account.Params) => Promise<Account.Result>;
}

export namespace Account {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Result = boolean;
}
