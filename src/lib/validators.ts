import Joi from "joi";
import { PASSWORD_MIN_LENGTH } from "./constants";

export const cardSchema = Joi.object({
	title: Joi.string().min(1).required(),
	description: Joi.string().min(1).required(),
	image: Joi.string().min(1).required(),
});

export const signupSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
});
