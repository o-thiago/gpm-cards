import { os } from "@orpc/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validators";

export const auth = os.router({
	signup: os
		.route({ method: "POST" })
		.input(signupSchema)
		.errors({
			DUPLICATE_EMAIL: {
				message: "Este e-mail já está em uso.",
			},
			UNKNOWN_ERROR: {
				message: "Não foi possível criar a conta. Tente novamente.",
			},
		})
		.handler(async ({ input, errors }) => {
			const hashedPassword = await bcrypt.hash(input.password, 10);
			try {
				const newUser = await db
					.insertInto("User")
					.values({
						id: crypto.randomUUID(),
						name: input.name,
						email: input.email,
						password: hashedPassword,
						role: "GUEST",
					})
					.returningAll()
					.executeTakeFirstOrThrow();
				return newUser;
			} catch (error) {
				if (
					error &&
					typeof error === "object" &&
					"code" in error &&
					error.code === "23505" // Violação de unicidade
				) {
					throw errors.DUPLICATE_EMAIL();
				}
				throw errors.UNKNOWN_ERROR();
			}
		}),
});
