"use strict";
import Payment from "../entity/payment.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Función para obtener pago
export async function getPagoService(query) {
  try {
    const { id, userId } = query;
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pagoFound = await pagoRepository.findOne({
      where: [{ id: id }, { userId: userId }],
    });
    if (!pagoFound) return [null, "Pago no encontrado"];
    return [pagoFound, null];
  } catch (error) {
    console.error("Error obtener el pago:", error);
    return [null, "Error interno del servidor"];
  }
}

// Función para obtener todos los pagos
export async function getPagosService() {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pagos = await pagoRepository.find();
    if (!pagos || pagos.length === 0) return [null, "No hay pagos"];
    return [pagos, null];
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    return [null, "Error interno del servidor"];
  }
}

//acutalizar pagos
export async function updatePagoService(query, body) {
  try {
    const { id, userId } = query;
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pagoFound = await pagoRepository.findOne({
      where: [{ id: id }, { userId: userId }],
    });
    if (!pagoFound) return [null, "Pago no encontrado"];
    const dataPagoUpdate = {
      amount: body.amount,
      type: body.type,
      receiptUrl: body.receiptUrl,
      status: body.status,
      validatedBy: body.validatedBy,
      validatedAt: body.validatedAt,
      updatedAt: new Date(),
    };
    await pagoRepository.update({ id: pagoFound.id }, dataPagoUpdate);
    const pagoData = await pagoRepository.findOne({ where: { id: pagoFound.id } });
    if (!pagoData) {
      return [null, "Pago no encontrado después de actualizar"];
    }
    return [pagoData, null];
  } catch (error) {
    console.error("Error al modificar un pago:", error);
    return [null, "Error interno del servidor"];
  }
}

//funcion para eliminar un pago
export async function deletePagoService(query) {
    try {
    const { id, userId } = query;
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pagoFound = await pagoRepository.findOne({
        where: [{ id: id }, { userId: userId }],
    });
    if (!pagoFound) return [null, "Pago no encontrado"];
    const pagoDeleted = await pagoRepository.remove(pagoFound);
    return [pagoDeleted, null];
    } catch (error) {
    console.error("Error al eliminar un pago:", error);
    return [null, "Error interno del servidor"];
    }
}

//funcion para crear un pago
export async function crearPagoService({ userId, amount, type, receiptUrl }) {
    try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const nuevoPago = pagoRepository.create({
         userId,
        amount,
        type,
        receiptUrl,
        status: "Pendiente",
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const pagoGuardado = await pagoRepository.save(nuevoPago);
    return [pagoGuardado, null];
    } catch (error) {
    return [null, error.message];
  }
}

export async function validarPagoService(paymentId, status, adminId) {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pago = await pagoRepository.findOneBy({ id: paymentId });
    if (!pago) return [null, "Pago no encontrado"];
    pago.status = status;
    pago.validatedBy = adminId;
    pago.validatedAt = new Date();
    pago.updatedAt = new Date();
    const pagoActualizado = await pagoRepository.save(pago);
    return [pagoActualizado, null];
  } catch (error) {
    return [null, error.message];
  }
}
