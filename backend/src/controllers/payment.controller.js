"use strict";
import { AppDataSource } from "../config/configDb.js";
import Payment from "../entity/payment.entity.js";
import { paymentBodyValidation as pagoBodyValidation, paymentValidateValidation as pagoValidateValidation } 
from "../validations/payment.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import {
    crearPagoService,
    deletePagoService,
    getPagoService, 
    getPagosService,
    updatePagoService,
    validarPagoService
} from "../services/payment.service.js";
   

//subir comprobante de pago user
export async function subirComprobante(req, res) {
  try {
    const { error } = pagoBodyValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    const { amount, type } = req.body;
    const receiptUrl = req.file ? req.file.path : null;
    if (!receiptUrl) return handleErrorClient(res, 400, "El comprobante es obligatorio");
    const userId = req.user.id;

    const [pago, errorPago] = await crearPagoService({ userId, amount, type, receiptUrl });
    if (errorPago) return handleErrorServer(res, 500, errorPago);

    handleSuccess(res, 201, "Comprobante subido correctamente", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// validar pago admin 
export async function validarPago(req, res) {
  try {
    const { error } = pagoValidateValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    const { paymentId, status } = req.body;
    const adminId = req.user.id;

    const [pago, errorPago] = await validarPagoService(paymentId, status, adminId);
    if (errorPago) return handleErrorServer(res, 500, errorPago);


    // Notificación simulada 
    console.log(
      `Notificación enviada al residente (userId: ${pago.userId}): ` + `su estado de pago es '${pago.status}'.`
    );

    handleSuccess(res, 200, "Pago validado", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// CRUD
export async function obtenerPago(req, res) {
  try {
    const { id } = req.params;
    const [pago, errorPago] = await getPagoService({ id });
    if (errorPago) return handleErrorClient(res, 404, errorPago);
    handleSuccess(res, 200, "Pago encontrado", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerPagos(req, res) {
  try {
    const [pagos, errorPagos] = await getPagosService();
    if (errorPagos) return handleErrorClient(res, 404, errorPagos);
    handleSuccess(res, 200, "Pagos encontrados", pagos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function actualizarPago(req, res) {
  try {
    const { id } = req.params;
    const [pago, errorPago] = await updatePagoService({ id }, req.body);
    if (errorPago) return handleErrorClient(res, 400, errorPago);
    handleSuccess(res, 200, "Pago actualizado", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function eliminarPago(req, res) {
  try {
    const { id } = req.params;
    const [pago, errorPago] = await deletePagoService({ id });
    if (errorPago) return handleErrorClient(res, 400, errorPago);
    handleSuccess(res, 200, "Pago eliminado", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}




























export async function createInitialPayments() {
  const pagoRepository = AppDataSource.getRepository(Payment);
  const pagos = [
    {
        userId: 1,
        amount: 50000,
        type: "gasto comun",
        receiptUrl: "uploads/recibo1.pdf",
        status: "Pendiente",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
      userId: 2,
      amount: 35000,
      type: "servicio basico",
      receiptUrl: "uploads/recibo2.pdf",
      status: "Pendiente",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 1,
      amount: 60000,
      type: "gasto comun",
      receiptUrl: "uploads/recibo3.pdf",
      status: "Pagado",
      validatedBy: 99,
      validatedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
  for (const pago of pagos) {
    const existe = await pagoRepository.findOneBy({
      userId: pago.userId,
      amount: pago.amount,
      type: pago.type
    });
    if (!existe) {
      await pagoRepository.save(pago);
    }
  }
}

