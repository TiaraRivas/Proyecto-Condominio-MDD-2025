"use strict";
import Joi from "joi";

//validación cuando el user sube el comprobante de pago
export const paymentBodyValidation = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "El monto debe ser numérico.",
    "number.positive": "El monto debe ser positivo.",
    "any.required": "El monto es obligatorio."
  }),
  type: Joi.string().valid("gasto comun", "servicio basico").required().messages({
    "any.only": "El tipo debe ser 'gasto comun' o 'servicio basico'.",
    "any.required": "El tipo es obligatorio."
  })
});

//validación para cuando un admin valida un pago 
export const paymentValidateValidation = Joi.object({
  paymentId: Joi.number().integer().positive().required().messages({
    "number.base": "El ID debe ser numérico.",
    "number.integer": "El ID debe ser entero.",
    "number.positive": "El ID debe ser positivo.",
    "any.required": "El ID del pago es obligatorio."
  }),
  status: Joi.string().valid("Pagado", "Pendiente").required().messages({
    "any.only": "El estado debe ser 'Pagado' o 'Pendiente'.",
    "any.required": "El estado es obligatorio."
  })
});
