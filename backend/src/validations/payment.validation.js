"use strict";

import Joi from "joi";

export const paymentBodyValidation = Joi.object({
  nombreCompleto: Joi.string().max(100).optional().messages({
    "string.base": "El nombre completo debe ser texto",
    "string.max": "El nombre completo no puede tener más de 100 caracteres",
  }),
  rut: Joi.string().max(12).required().messages({
  "string.base": "El RUT debe ser texto",
  "string.empty": "El RUT es obligatorio",
  "string.max": "El RUT no puede tener más de 12 caracteres",
  "any.required": "El RUT es obligatorio",
}),
  monto: Joi.number().positive().required().messages({
    "number.base": "El monto debe ser numérico",
    "number.positive": "El monto debe ser positivo",
    "any.required": "El monto es obligatorio",
  }),
  tipo_de_pago: Joi.string().default("gasto común").optional().messages({
    "string.base": "El tipo de pago debe ser texto",
  }),
  comprobante_url: Joi.string().allow(null, "").optional().messages({
    "string.base": "La URL del comprobante debe ser texto",
  }),
  fecha_pago: Joi.date().iso().optional().messages({
    "date.base": "La fecha de pago debe ser una fecha válida",
    "date.format": "La fecha debe tener formato (2000-01-01)",
  }),
  mes_referencia: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
    .optional()
    .messages({
      "string.pattern.base": "El mes referencia debe tener formato YYYY-MM",
    }),
  observaciones: Joi.string().allow(null, "").optional(),
});
