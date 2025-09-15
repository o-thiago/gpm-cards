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

const adminMiddleware = os
	.$context<{ session?: Session }>()
	.middleware(async ({ context, next }) => {
		if (context.session?.user?.role !== "ADMIN") {
			throw new Error("FORBIDDEN");
		}
		return await next({ context });
	});

const protectedRoute = os.use(authMiddleware);
const adminRoute = os.use(authMiddleware).use(adminMiddleware);

export const cards = os.router({
	get: os
		.route({ method: "GET" })
		.handler(async () => await db.selectFrom("cards").selectAll().execute()),
	create: adminRoute.input(cardSchema).handler(async ({ input }) => {
		return await db
			.insertInto("cards")
			.values(input)
			.returningAll()
			.executeTakeFirstOrThrow();
	}),
	update: adminRoute
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
	delete: adminRoute
		.input(Joi.object({ id: Joi.string().uuid() }))
		.handler(async ({ input: { id } }) => {
			return await db
				.deleteFrom("cards")
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
		}),
});
