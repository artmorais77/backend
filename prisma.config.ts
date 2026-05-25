import { env } from "./src/env"
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/database/",
  migrations: {
    path: "src/database/migrations",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
