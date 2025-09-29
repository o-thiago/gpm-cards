import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable("Cards")
    .addColumn("metadata", "jsonb")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable("Cards").dropColumn("metadata").execute();
}
