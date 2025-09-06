import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

interface CardTable {
	id: string;
	name: string;
	description: string;
	imageUrl: string;
}

interface Database {
	card: CardTable;
}

const dialect = new PostgresDialect({
	pool: new Pool({
		host: "localhost",
		port: 5433,
		database: "gpm-cards-db",
	}),
});

export const db = new Kysely<Database>({
	dialect,
});
