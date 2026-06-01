const Joi = require("joi");

const createEarningSchema = Joi.object({
  projectId: Joi.string().hex().length(24).messages({
    "string.hex": "الـ Project ID مش صحيح",
    "string.length": "الـ Project ID لازم يكون 24 حرف",
  }),
  amount: Joi.number().min(0).required().messages({
    "number.base": "المبلغ لازم يكون رقم",
    "any.required": "المبلغ مطلوب",
  }),
  platform: Joi.string(),
  paidAt: Joi.date(),
  note: Joi.string(),
});

module.exports = { createEarningSchema };
