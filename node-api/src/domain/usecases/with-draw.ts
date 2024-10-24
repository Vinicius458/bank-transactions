export interface WithDraw {
  execute(data: WithDraw.Params): Promise<void>;
}

export namespace WithDraw {
  export type Params = {
    accountId: number;
    amount: number;
  };
}
