import type { Database as AuthDatabase } from "@auth/kysely-adapter";
import { KyselyAdapter } from "@auth/kysely-adapter";
import bcrypt from "bcrypt";
import { Kysely, PostgresDialect } from "kysely";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import { db } from "@/lib/db";

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: process.env.POSTGRES_URL,
	}),
});

const authDb = new Kysely<AuthDatabase>({
	dialect,
});

export const authOptions: NextAuthOptions = {
	adapter: KyselyAdapter(authDb),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					return null;
				}

				const user = await db
					.selectFrom("User")
					.selectAll()
					.where("email", "=", credentials.email as string)
					.executeTakeFirst();

				if (user?.password) {
					const passwordMatch = await bcrypt.compare(
						credentials.password,
						user.password,
					);
					if (passwordMatch) {
						return user;
					}
				}
				return null;
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.role = token.role;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
};
