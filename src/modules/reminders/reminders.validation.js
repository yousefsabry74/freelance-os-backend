const Joi = require("joi");

const createReminderSchema = Joi.object({
  projectId: Joi.string().hex().length(24).messages({
    "string.hex": "الـ Project ID مش صحيح",
    "string.length": "الـ Project ID لازم يكون 24 حرف",
  }),
  title: Joi.string().min(2).max(200).required().messages({
    "string.empty": "عنوان التذكير مطلوب",
    "string.min": "العنوان لازم يكون أكتر من حرفين",
  }),
  description: Joi.string(),
  dueDate: Joi.date().required().messages({
    "any.required": "تاريخ التذكير مطلوب",
  }),
  status: Joi.string().valid("pending", "done"),
  priority: Joi.string().valid("low", "medium", "high"),
});

const updateReminderSchema = Joi.object({
  projectId: Joi.string().hex().length(24),
  title: Joi.string().min(2).max(200),
  description: Joi.string(),
  dueDate: Joi.date(),
  status: Joi.string().valid("pending", "done"),
  priority: Joi.string().valid("low", "medium", "high"),
});

module.exports = { createReminderSchema, updateReminderSchema };
