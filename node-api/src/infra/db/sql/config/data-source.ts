import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "bank2142",
  synchronize: true,
  logging: false,
  entities: [],
  subscribers: [],
});
