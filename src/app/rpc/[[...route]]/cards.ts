import { os } from "@orpc/server";
import Joi from "joi";
import type { Session } from "next-auth";
import { db } from "@/lib/db";
import { cardSchema } from "@/lib/validators";

const authMiddleware = os
	.$context<{ session?: Session }>()
	.middleware(async ({ context, next }) => {
		if (!context.session?.user) {
			throw new Error("UNAUTHORIZED");
		}

		return await next({ context });
	});

const protectedRoute = os.use(authMiddleware);

export const cards = os.router({
	get: os
		.route({ method: "GET" })
		.handler(async () => await db.selectFrom("cards").selectAll().execute()),
	create: protectedRoute.input(cardSchema).handler(async ({ input }) => {
		return await db
			.insertInto("cards")
			.values(input)
			.returningAll()
			.executeTakeFirstOrThrow();
	}),
	update: protectedRoute
		.input(cardSchema.keys({ id: Joi.string().uuid() }))
		.handler(async ({ input }) => {
			const { id, ...updateData } = input;
			return await db
				.updateTable("cards")
				.set(updateData)
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
		}),
	delete: protectedRoute
		.input(Joi.object({ id: Joi.string().uuid() }))
		.handler(async ({ input: { id } }) => {
			return await db
				.deleteFrom("cards")
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
		}),
});
