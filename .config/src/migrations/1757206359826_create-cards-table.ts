import { Kysely, sql } from 'kysely'
import { GPMDatabase } from '../../../src/lib/db'

export async function up(db: Kysely<GPMDatabase>): Promise<void> {
  await db.schema
    .createTable('Cards')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('image', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('Cards').execute()
}
