const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "الاسم مطلوب",
    "string.min": "الاسم لازم يكون أكتر من حرفين",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "الإيميل مش صحيح",
    "string.empty": "الإيميل مطلوب",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "الباسوورد لازم يكون 6 أحرف على الأقل",
    "string.empty": "الباسوورد مطلوب",
  }),
  role: Joi.string().valid("freelancer", "instructor"),
  specialty: Joi.string(),
  platforms: Joi.array().items(Joi.string()),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "الإيميل مش صحيح",
    "string.empty": "الإيميل مطلوب",
  }),
  password: Joi.string().required().messages({
    "string.empty": "الباسوورد مطلوب",
  }),
});

module.exports = { registerSchema, loginSchema };
