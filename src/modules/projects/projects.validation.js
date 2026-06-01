const Joi = require("joi");

const createProjectSchema = Joi.object({
  clientId: Joi.string().hex().required().length(24).messages({
    "string.hex": "الـ Client ID مش صحيح",
    "string.length": "الـ Client ID لازم يكون 24 حرف",
  }),
  title: Joi.string().min(2).max(200).required().messages({
    "string.empty": "اسم المشروع مطلوب",
    "string.min": "اسم المشروع لازم يكون أكتر من حرفين",
  }),
  description: Joi.string(),
  status: Joi.string()
    .valid("pending", "in-progress", "done", "cancelled")
    .required(),
  budget: Joi.number().min(0),
  deadline: Joi.date(),
  platform: Joi.string(),
});

const updateProjectSchema = Joi.object({
  clientId: Joi.string().hex().length(24),
  title: Joi.string().min(2).max(200),
  description: Joi.string(),
  status: Joi.string().valid("pending", "in-progress", "done", "cancelled"),
  budget: Joi.number().min(0),
  deadline: Joi.date(),
  platform: Joi.string(),
});

module.exports = { createProjectSchema, updateProjectSchema };
