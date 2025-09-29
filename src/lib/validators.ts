import Joi from "joi";
import { PASSWORD_MIN_LENGTH } from "./constants";

export const cardSchema = Joi.object({
	title: Joi.string().min(1).required(),
	description: Joi.string().min(1).required(),
	image: Joi.string().min(1).required(),
	category: Joi.string().valid("RULE", "WARNING", "LINK").required(),
	metadata: Joi.when("category", {
		is: "LINK",
		then: Joi.object({
			link: Joi.string().uri().required(),
		}).required(),
		otherwise: Joi.object().optional(),
	}),
});

export const signupSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
});
