import Joi from "joi";

export const cardSchema = Joi.object({
	title: Joi.string().min(1).required(),
	description: Joi.string().min(1).required(),
	image: Joi.string().min(1).required(),
});
