import "reflect-metadata";
import { DataSource } from "typeorm";
import { Account } from "../account/account.entity";
import { Transaction } from "../transaction/transaction.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123",
  database: "bank", // banco de dados para teste
  entities: [Account, Transaction],
  synchronize: true, // cria as tabelas automaticamente no banco de teste
});

export const initializeTestDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};
