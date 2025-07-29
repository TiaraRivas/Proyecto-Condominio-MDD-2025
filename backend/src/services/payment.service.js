"use strict";
import { AppDataSource } from "../config/configDb.js";
import Payment from "../entity/payment.entity.js";

export async function crearPagoService(pagoData) {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const nuevoPago = pagoRepository.create({
      rut: pagoData.rut,
      monto: pagoData.monto,
      fecha_pago: pagoData.fecha_pago,
      comprobante_url: pagoData.comprobante_url,
      mes_referencia: pagoData.mes_referencia,
      observaciones: pagoData.observaciones,
      tipo_de_pago: pagoData.tipo_de_pago || "gasto común",
      estado: "pendiente",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const pagoGuardado = await pagoRepository.save(nuevoPago);
    return [pagoGuardado, null];
  } catch (error) {
    console.error("Error en crearPagoService:", error);
    return [null, error.message];
  }
}

export async function getPagoService(query) {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pago = await pagoRepository.findOneBy(query);
    if (!pago) return [null, "Pago no encontrado"];
    return [pago, null];
  } catch (error) {
    console.error("Error en getPagoService:", error);
    return [null, "Error al buscar el pago"];
  }
}

export async function getPagosService(filters = {}) {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pagos = await pagoRepository.find({
      where: filters,
      order: { createdAt: "DESC" }
    });
    return [pagos, null];
  } catch (error) {
    console.error("Error en getPagosService:", error);
    return [null, "Error al obtener pagos"];
  }
}

export async function listarPagosService(filters = {}) {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);

    const whereConditions = {};
    if (filters.rut) whereConditions.rut = filters.rut;
    if (filters.estado) whereConditions.estado = filters.estado;
    if (filters.mes_referencia) whereConditions.mes_referencia = filters.mes_referencia;

    const pagos = await pagoRepository.find({
      where: whereConditions,
      order: { createdAt: "DESC" },
      relations: ["usuario"] // Si tienes relación con usuario
    });

    return [pagos, null];
  } catch (error) {
    console.error("Error en listarPagosService:", error);
    return [null, "Error al listar pagos"];
  }
}

export async function updatePagoService(pago_id, updateData) {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pago = await pagoRepository.findOneBy({ pago_id });

    if (!pago) return [null, "Pago no encontrado"];

    const camposPermitidos = [
      "observaciones",
      "comprobante_url",
      "fecha_pago",
      "estado"
    ];

    Object.keys(updateData).forEach(key => {
      if (camposPermitidos.includes(key)) {
        pago[key] = updateData[key];
      }
    });

    pago.updatedAt = new Date();
    const pagoActualizado = await pagoRepository.save(pago);
    return [pagoActualizado, null];
  } catch (error) {
    console.error("Error en updatePagoService:", error);
    return [null, "Error al actualizar pago"];
  }
}

export async function deletePagoService(pago_id) {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pago = await pagoRepository.findOneBy({ pago_id });

    if (!pago) return [null, "Pago no encontrado"];

    await pagoRepository.remove(pago);
    return [{ pago_id, message: "Pago eliminado" }, null];
  } catch (error) {
    console.error("Error en deletePagoService:", error);
    return [null, "Error al eliminar pago"];
  }
}

export async function validarPagoService(pago_id, estado, adminId) {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pago = await pagoRepository.findOneBy({ pago_id });

    if (!pago) return [null, "Pago no encontrado"];

    pago.estado = estado;
    pago.validatedBy = adminId;
    pago.validatedAt = new Date();
    pago.updatedAt = new Date();

    const pagoActualizado = await pagoRepository.save(pago);
    return [pagoActualizado, null];
  } catch (error) {
    console.error("Error en validarPagoService:", error);
    return [null, "Error al validar pago"];
  }
}

export async function precargarPagosService(pagosData) {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const resultados = [];

    for (const pagoData of pagosData) {
      const existe = await pagoRepository.findOneBy({
        rut: pagoData.rut,
        mes_referencia: pagoData.mes_referencia
      });

      if (!existe) {
        const nuevoPago = pagoRepository.create({
          ...pagoData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await pagoRepository.save(nuevoPago);
        resultados.push({ success: true, rut: pagoData.rut });
      } else {
        resultados.push({ success: false, rut: pagoData.rut, message: "Ya existe" });
      }
    }

    return [resultados, null];
  } catch (error) {
    console.error("Error en precargarPagosService:", error);
    return [null, error.message];
  }
}
