const Joi = require("joi");

exports.vacancyValidation = (data) => {
  const schema = Joi.object({
    employer_id: Joi.number().integer(),
    city: Joi.string(),
    job_id: Joi.number().integer(),
    salary: Joi.number().integer(),
    description: Joi.string(),
    requirements: Joi.string(),
    internship: Joi.string(),
    job_type: Joi.string().valid(
      "full-time",
      "part-time",
      "contract",
      "freelance"
    ),
    medicine: Joi.boolean().default(false),
    housing: Joi.boolean().default(false),
    gender: Joi.string().valid("male", "female"),
    age_limit: Joi.string(),
    graduate: Joi.string().valid("yes", "no"),
    experience: Joi.string(),
    trial_period: Joi.string(),
    work_hour: Joi.string(),
    exprience: Joi.string(),
  });
  return schema.validate(data, { abortEarly: false });
};
