import { setupApp } from "./config/app";
import env from "@/main/config/env";
import "reflect-metadata";

const port: number = Number(env.port) || 3000;
const app = setupApp();
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
