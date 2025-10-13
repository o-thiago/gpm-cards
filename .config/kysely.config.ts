import { defineConfig } from 'kysely-ctl'
import { PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import 'dotenv/config'

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  migrations: {
    migrationFolder: "src/migrations",
  },
})
