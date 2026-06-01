const Joi = require("joi");

const createClientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "اسم العميل مطلوب",
    "string.min": "اسم العميل لازم يكون أكتر من حرفين",
  }),
  email: Joi.string().email().messages({
    "string.email": "الإيميل مش صحيح",
  }),
  phone: Joi.string(),
  company: Joi.string(),
  notes: Joi.string(),
  platform: Joi.string(),
});

const updateClientSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string(),
  company: Joi.string(),
  notes: Joi.string(),
  platform: Joi.string(),
});

module.exports = { createClientSchema, updateClientSchema };
