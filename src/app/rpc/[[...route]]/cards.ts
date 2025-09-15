import { os } from "@orpc/server";
import Joi from "joi";
import type { Session } from "next-auth";
import { db } from "@/lib/db";
import { cardSchema } from "@/lib/validators";

const adminMiddleware = os
	.$context<{ session?: Session }>()
	.middleware(async ({ context, next }) => {
		if (context.session?.user?.role !== "ADMIN") {
			throw new Error("FORBIDDEN");
		}
		return await next({ context });
	});

const adminRoute = os.use(adminMiddleware);

export const cards = os.router({
	get: os
		.route({ method: "GET" })
		.handler(async () => await db.selectFrom("Cards").selectAll().execute()),
	create: adminRoute.input(cardSchema).handler(async ({ input }) => {
		return await db
			.insertInto("Cards")
			.values(input)
			.returningAll()
			.executeTakeFirstOrThrow();
	}),
	update: adminRoute
		.input(cardSchema.keys({ id: Joi.string().uuid() }))
		.handler(async ({ input }) => {
			const { id, ...updateData } = input;
			return await db
				.updateTable("Cards")
				.set(updateData)
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
		}),
	delete: adminRoute
		.input(Joi.object({ id: Joi.string().uuid() }))
		.handler(async ({ input: { id } }) => {
			return await db
				.deleteFrom("Cards")
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
		}),
});
