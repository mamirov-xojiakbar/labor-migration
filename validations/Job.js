const Joi = require("joi");

exports.jobValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).min(2).max(50),
    description: Joi.string(),
    icon: Joi.string(),
  });
  return schema.validate(data, { abortEarly: false });
};
