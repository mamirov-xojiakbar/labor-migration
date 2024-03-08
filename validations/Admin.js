const Joi = require("joi");

exports.adminValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).min(2).max(50),
    email: Joi.string().email(),
    hashed_password: Joi.string(),
    phone_number: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    tg_link: Joi.string(),
    is_active: Joi.boolean().default(false),
    is_creator: Joi.boolean().default(false),
    hashed_refresh_token: Joi.string(),
    description: Joi.string(),
  });
  return schema.validate(data, { abortEarly: false });
};
