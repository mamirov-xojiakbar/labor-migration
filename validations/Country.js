const Joi = require("joi");

exports.countryValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).min(2).max(50),
    flag: Joi.string(),
  });
  return schema.validate(data, { abortEarly: false });
};
