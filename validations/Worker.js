const Joi = require("joi");

exports.workerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    birth_date: Joi.date(),
    gender: Joi.string().valid("male", "female"),
    passport: Joi.string(),
    phone_number: Joi.string(),
    email: Joi.string().email(),
    tg_link: Joi.string().uri(),
    hashed_password: Joi.string(),
    hashed_refresh_token: Joi.string(),
    is_active: Joi.boolean().default(false),
    graduate: Joi.string().valid("yes", "no"),
    skills: Joi.string(),
    experience: Joi.number().integer(),
  });
  return schema.validate(data, { abortEarly: false });
};
