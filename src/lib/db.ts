import type { AdapterUser } from "@auth/core/adapters";
import type { Database as AuthDatabase } from "@auth/kysely-adapter";
import type { ColumnType } from "kysely";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export type Generated<T> = T | ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type CardCategory = "RULE" | "WARNING" | "LINK";

export interface CardsTable {
	id: Generated<string>;
	title: string;
	description: string;
	image: string;
	createdAt: Generated<Timestamp>;
}

interface User extends AdapterUser {
	password?: string | null;
	role: "GUEST" | "ADMIN";
}

export interface GPMDatabase extends AuthDatabase {
	Cards: CardsTable;
	User: User;
}

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: process.env.POSTGRES_URL,
	}),
});

export const db = new Kysely<GPMDatabase>({
	dialect,
});
