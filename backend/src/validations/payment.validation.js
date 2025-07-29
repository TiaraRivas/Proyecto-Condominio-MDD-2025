"use strict";

import Joi from "joi";

export const paymentBodyValidation = Joi.object({
  rut: Joi.string().max(12).required().messages({
    "string.base": "El RUT debe ser texto",
    "string.empty": "El RUT es obligatorio",
    "string.max": "El RUT no puede tener más de 12 caracteres",
    "any.required": "El RUT es obligatorio"
  }),
  monto: Joi.number().positive().required().messages({
    "number.base": "El monto debe ser numérico",
    "number.positive": "El monto debe ser positivo",
    "any.required": "El monto es obligatorio"
  }),
  tipo: Joi.string().required().messages({
    "string.empty": "El tipo de pago es obligatorio",
    "any.required": "El tipo de pago es obligatorio"
  }),
  url_comprobante: Joi.string().required().messages({
    "string.empty": "La URL del comprobante es obligatoria",
    "any.required": "La URL del comprobante es obligatoria"
  }),
  mes: Joi.string().required().messages({
    "string.empty": "El mes es obligatorio",
    "any.required": "El mes es obligatorio"
  }),
  año: Joi.number().integer().min(2000).required().messages({
    "number.base": "El año debe ser un número",
    "number.min": "El año debe ser mayor o igual a 2000",
    "any.required": "El año es obligatorio"
  }),
  estado: Joi.string().valid("pendiente", "validado").default("pendiente"),
  id_usuario: Joi.number().integer().required().messages({
    "number.base": "ID de usuario debe ser un número",
    "any.required": "ID de usuario es obligatorio"
  }),
});

export const paymentValidateValidation = Joi.object({
  estado: Joi.string().valid("validado").required().messages({
    "any.only": "Solo se permite el estado 'validado'",
    "any.required": "El estado es obligatorio"
  }),
  validado_por: Joi.string().required().messages({
    "string.empty": "El campo 'validado por' es obligatorio",
    "any.required": "El campo 'validado por' es obligatorio"
  })
});
