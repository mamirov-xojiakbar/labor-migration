const Joi = require("joi");

exports.applicationValidation = (data) => {
  const schema = Joi.object({
    vacancy_id: Joi.number().integer(),
    worker_id: Joi.number().integer(),
    application_date: Joi.date(),
  });
  return schema.validate(data, { abortEarly: false });
};
