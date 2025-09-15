import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createType('category')
    .asEnum(["RULE", "WARNING", "LINK"])
    .execute();

    await db.schema.alterTable("Cards")
    .addColumn("category", sql`category`, (col) => col.defaultTo("RULE"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable("Cards").dropColumn("category").execute();
    await db.schema.dropType("category").execute();
}
