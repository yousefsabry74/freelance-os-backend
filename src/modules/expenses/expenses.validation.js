const Joi = require("joi");

const createExpenseSchema = Joi.object({
  title: Joi.string().min(2).max(200).required().messages({
    "string.empty": "اسم المصروف مطلوب",
    "string.min": "اسم المصروف لازم يكون أكتر من حرفين",
  }),
  amount: Joi.number().min(0).required().messages({
    "number.base": "المبلغ لازم يكون رقم",
    "any.required": "المبلغ مطلوب",
  }),
  category: Joi.string().valid("subscription", "tools", "internet", "hosting", "marketing", "other"),
  recurring: Joi.boolean(),
  date: Joi.date(),
  note: Joi.string(),
});

const updateExpenseSchema = Joi.object({
  title: Joi.string().min(2).max(200),
  amount: Joi.number().min(0),
  category: Joi.string().valid("subscription", "tools", "internet", "hosting", "marketing", "other"),
  recurring: Joi.boolean(),
  date: Joi.date(),
  note: Joi.string(),
});

module.exports = { createExpenseSchema, updateExpenseSchema };
