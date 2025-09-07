import { os } from "@orpc/server";
import Joi from "joi";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export const auth = os.router({
  signup: os
    .route({ method: "POST" })
    .input(Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }))
    .handler(async ({ input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newUser = await db
        .insertInto('User')
        .values({
          id: crypto.randomUUID(),
          name: input.name,
          email: input.email,
          password: hashedPassword,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      return newUser;
    }),
});
