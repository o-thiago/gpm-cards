import { os } from "@orpc/server";
import Joi from "joi";
import { db } from "@/lib/db";
import { cardSchema } from "@/lib/validators";

export const cards = os.router({
	get: os
		.route({ method: "GET" })
		.handler(async () => await db.selectFrom("cards").selectAll().execute()),
	create: os
		.route({ method: "POST" })
		.input(cardSchema)
		.handler(async ({ input }) => {
			return await db
				.insertInto("cards")
				.values(input)
				.returningAll()
				.executeTakeFirstOrThrow();
		}),
	update: os
		.route({ method: "PUT" })
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
	delete: os
		.route({ method: "DELETE" })
		.input(Joi.object({ id: Joi.string().uuid() }))
		.handler(async ({ input: { id } }) => {
			return await db
				.deleteFrom("cards")
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
		}),
});
