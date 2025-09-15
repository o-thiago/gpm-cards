import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('Role')
    .asEnum(['ADMIN', 'GUEST'])
    .execute()
  await db.schema
    .createTable('User')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('name', 'text')
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .addColumn('emailVerified', 'timestamptz')
    .addColumn('image', 'text')
    .addColumn('password', 'text')
    .addColumn('role', 'Role', (col) => col.defaultTo('GUEST').notNull())
    .execute()

  await db.schema
    .createTable('Account')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('userId', 'text', (col) => col.references('User.id').onDelete('cascade').notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('providerAccountId', 'text', (col) => col.notNull())
    .addColumn('refresh_token', 'text')
    .addColumn('access_token', 'text')
    .addColumn('expires_at', 'integer')
    .addColumn('token_type', 'text')
    .addColumn('scope', 'text')
    .addColumn('id_token', 'text')
    .addColumn('session_state', 'text')
    .execute()

  await db.schema
    .createTable('Session')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('userId', 'text', (col) => col.references('User.id').onDelete('cascade').notNull())
    .addColumn('sessionToken', 'text', (col) => col.unique().notNull())
    .addColumn('expires', 'timestamptz', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('VerificationToken')
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.unique().notNull())
    .addColumn('expires', 'timestamptz', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('VerificationToken').execute()
  await db.schema.dropTable('Session').execute()
  await db.schema.dropTable('Account').execute()
  await db.schema.dropTable('User').execute()
  await db.schema.dropType('Role').execute()
}
