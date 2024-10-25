export interface Transfer {
  execute(data: Transfer.Params): Promise<void>;
}

export namespace Transfer {
  export type Params = {
    sourceAccountId: number;
    targetAccountId: number;
    amount: number;
  };
}
