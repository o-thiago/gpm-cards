import type { ColumnType } from "kysely";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export type Generated<T> = T | ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface CardsTable {
	id: Generated<string>;
	title: string;
	description: string;
	image: string;
	createdAt: Generated<Timestamp>;
}

export interface Database {
	cards: CardsTable;
}

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: process.env.POSTGRES_URL,
	}),
});

export const db = new Kysely<Database>({
	dialect,
});

