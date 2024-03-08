const Joi = require("joi");

exports.employerValidation = (data) => {
  const schema = Joi.object({
    company_name: Joi.string()
      .pattern(new RegExp("^[a-zA-Z]+$"))
      .min(2)
      .max(50),
    industry: Joi.string(),
    country_id: Joi.number().integer(),
    address: Joi.string(),
    location: Joi.string(),
    author_password: Joi.string().min(6),
    contact_name: Joi.string()
      .pattern(new RegExp("^[a-zA-Z]+$"))
      .min(2)
      .max(50),
    contact_passport: Joi.string(),
    contact_email: Joi.string().email(),
    contact_phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    hashed_password: Joi.string(),
    hashed_refresh_token: Joi.string(),
  });
  return schema.validate(data, { abortEarly: false });
};
