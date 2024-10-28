import { adaptRoute } from "@/main/adapters";
import { makeTransactionController } from "@/main/factories";

import { Router } from "express";

export default async (router: Router): Promise<void> => {
  const transactionController = await makeTransactionController();
  router.post("/process-transactions", adaptRoute(transactionController));
};
