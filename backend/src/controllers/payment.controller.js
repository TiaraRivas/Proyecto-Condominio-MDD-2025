"use strict";
import { AppDataSource } from "../config/configDb.js";
import Payment from "../entity/payment.entity.js";
import User from "../entity/user.entity.js";
import { paymentBodyValidation } from "../validations/payment.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import {
  crearPagoService,
  deletePagoService,
  getPagoService,
  getPagosService,
  listarPagosService,
  updatePagoService,
  validarPagoService,
} from "../services/payment.service.js";

// Subir comprobante de pago (usuario)
export async function subirComprobante(req, res) {
  try {
    if (!req.user) return handleErrorClient(res, 401, "No autenticado");
    if (req.user.rol !== "usuario") return handleErrorClient(res, 403, "Solo usuarios pueden subir comprobantes");

    const { error, value } = paymentBodyValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    // Buscar datos del usuario a partir del RUT
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { rut: value.rut } });

    if (!user) return handleErrorClient(res, 404, "Usuario no encontrado con ese RUT");

    const pagoData = {
      nombreCompleto: user.nombreCompleto,
      email: user.email,
      rut: user.rut,
      monto: value.monto,
      fecha_pago: value.fecha_pago,
      comprobante_url: req.file ? req.file.path : value.comprobante_url || null,
      mes_referencia: value.mes_referencia,
      observaciones: value.observaciones || null,
      tipo_de_pago: value.tipo_de_pago || "gasto común",
    };

    if (!pagoData.comprobante_url) return handleErrorClient(res, 400, "El comprobante es obligatorio");

    const [pago, errorPago] = await crearPagoService(pagoData);
    if (errorPago) return handleErrorServer(res, 500, errorPago);

    handleSuccess(res, 201, "Comprobante subido correctamente", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Validar pago (admin)
export async function validarPago(req, res) {
  try {
    if (!req.user) return handleErrorClient(res, 401, "No autenticado");
    if (req.user.rol !== "administrador") return handleErrorClient(res, 403, 
      "Solo administradores pueden validar pagos");

    const { id } = req.params;
    const { estado } = req.body;

    if (!id || !estado) return handleErrorClient(res, 400, "ID de pago y estado son requeridos");

    const estadosValidos = ["pendiente", "aceptado", "rechazado"];
    if (!estadosValidos.includes(estado.toLowerCase())) {
      return handleErrorClient(res, 400, "Estado inválido. Usa: pendiente, aceptado o rechazado");
    }

    const [pago, errorPago] = await validarPagoService(id, estado.toLowerCase(), req.user.id);
    if (errorPago) return handleErrorServer(res, 500, errorPago);

    handleSuccess(res, 200, "Pago validado correctamente", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Listar todos los pagos (admin)
export async function listarPagosAdmin(req, res) {
  try {
    if (!req.user) return handleErrorClient(res, 401, "No autenticado");
    if (req.user.rol !== "administrador") return handleErrorClient(res, 403, 
      "Solo administradores pueden listar todos los pagos");

    const [pagos, errorPagos] = await listarPagosService();
    if (errorPagos) return handleErrorClient(res, 404, errorPagos);

    handleSuccess(res, 200, "Listado de pagos obtenido con éxito", pagos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Historial por RUT (admin)
export async function obtenerHistorialPorRut(req, res) {
  try {
    if (!req.user) return handleErrorClient(res, 401, "No autenticado");
    if (req.user.rol !== "administrador") return handleErrorClient(res, 403, 
      "Solo administradores pueden acceder al historial por RUT");

    const { rut } = req.params;
    if (!rut) return handleErrorClient(res, 400, "El RUT es obligatorio");

    const [pagos, errorPagos] = await listarPagosService({ rut });
    if (errorPagos) return handleErrorClient(res, 404, errorPagos);

    handleSuccess(res, 200, `Historial de pagos para el RUT ${rut}`, pagos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener historial del usuario actual
export async function obtenerPagos(req, res) {
  try {
    if (!req.user) return handleErrorClient(res, 401, "No autenticado");

    const [pagos, errorPagos] = await listarPagosService({ rut: req.user.rut });
    if (errorPagos) return handleErrorClient(res, 404, errorPagos);

    handleSuccess(res, 200, "Historial de pagos obtenido", pagos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener un pago específico
export async function obtenerPago(req, res) {
  try {
    const { id } = req.params;
    const [pago, errorPago] = await getPagoService({ id });
    if (errorPago) return handleErrorClient(res, 404, errorPago);

    if (req.user.role !== "administrador" && pago.rut !== req.user.rut) {
      return handleErrorClient(res, 403, "No autorizado");
    }

    handleSuccess(res, 200, "Pago encontrado", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar pago
export async function actualizarPago(req, res) {
  try {
    const { id } = req.params;
    const [pagoActual, errorActual] = await getPagoService({ id });
    if (errorActual) return handleErrorClient(res, 404, errorActual);

    if (req.user.role !== "administrador" && pagoActual.rut !== req.user.rut) {
      return handleErrorClient(res, 403, "No autorizado");
    }

    const camposPermitidos = ["observaciones", "comprobante_url", "fecha_pago", "monto", "mes_referencia"];
    const datosActualizados = {};

    for (const campo in req.body) {
      if (camposPermitidos.includes(campo)) {
        datosActualizados[campo] = req.body[campo];
      }
    }

    const [pago, errorPago] = await updatePagoService(id, datosActualizados);
    if (errorPago) return handleErrorClient(res, 400, errorPago);

    handleSuccess(res, 200, "Pago actualizado", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar pago
export async function eliminarPago(req, res) {
  try {
    const { id } = req.params;
    const [pagoActual, errorActual] = await getPagoService({ id });
    if (errorActual) return handleErrorClient(res, 404, errorActual);

    if (req.user.role !== "administrador" && pagoActual.rut !== req.user.rut) {
      return handleErrorClient(res, 403, "No autorizado");
    }

    const [pago, errorPago] = await deletePagoService(id);
    if (errorPago) return handleErrorClient(res, 400, errorPago);

    handleSuccess(res, 200, "Pago eliminado", pago);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Precarga inicial de pagos
export async function createInitialPayments() {
  try {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pagos = [
      {
        nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
        email: "usuario2.2024@gmail.cl",
        rut: "20.630.735-8",
        monto: 50000,
        tipo_de_pago: "gasto comun",
        fecha_pago: "2025-07-01",
        comprobante_url: "uploads/recibo1.pdf",
        mes_referencia: "2025-07",
        observaciones: "Pago inicial",
        estado: "Pendiente",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombreCompleto: "Felipe Andrés Henríquez Zapata",
        email: "usuario4.2024@gmail.cl",
        rut: "20.976.635-3",
        monto: 35000,
        tipo_de_pago: "gasto comun",
        fecha_pago: "2025-07-05",
        comprobante_url: "uploads/recibo2.pdf",
        mes_referencia: "2025-07",
        observaciones: "Pago inicial",
        estado: "Pendiente",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombreCompleto: "Juan Pablo Rosas Martin",
        email:"usuario6.2024@gmail.cl",
        rut: "20.738.415-1",
        monto: 60000,
        tipo_de_pago: "gasto comun",
        fecha_pago: "2025-07-10",
        comprobante_url: "uploads/recibo3.pdf",
        mes_referencia: "2025-07",
        observaciones: "Pago inicial",
        estado: "aceptado",
        validatedBy: 1,
        validatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    for (const pago of pagos) {
      const existe = await pagoRepository.findOneBy({
        rut: pago.rut,
        monto: pago.monto,
        mes_referencia: pago.mes_referencia
      });

      if (!existe) {
        await pagoRepository.save(pago);
        console.log(`Pago creado para el rut ${pago.rut}`);
      } else {
        console.log(`Pago ya existía para el rut ${pago.rut}`);
      }
    }

    return { success: true, message: "Pagos iniciales creados correctamente" };
  } catch (error) {
    console.error("Error al crear pagos iniciales:", error);
    return { success: false, message: error.message };
  }
}
