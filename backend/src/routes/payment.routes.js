"use strict";
import { Router } from "express";
import multer from "multer";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  actualizarPago,
  createInitialPayments,
  eliminarPago,
  listarPagosAdmin,
  obtenerHistorialPorRut,
  obtenerPago,
  obtenerPagos,
  subirComprobante,
  validarPago,
} from "../controllers/payment.controller.js";

const router = Router();

// Configuración de multer para subir comprobantes
const upload = multer({ 
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite: 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos PDF o imágenes"), false);
    }
  }
});

// ══════════════════════════════════════════════
// ░░ RUTAS PARA USUARIOS AUTENTICADOS ░░
// ══════════════════════════════════════════════

// Subir comprobante
router.post("/comprobante", authenticateJwt, upload.single("comprobante"), subirComprobante);

// Ver pagos propios
router.get("/mis-pagos", authenticateJwt, obtenerPagos);

// Obtener pago específico
router.get("/:pago_id", authenticateJwt, obtenerPago);

// Actualizar un pago
router.patch("/actualizar/:pago_id", authenticateJwt, actualizarPago);

// Eliminar un pago
router.delete("/eliminar/:pago_id", authenticateJwt, eliminarPago);

// ══════════════════════════════════════════════
// ░░ RUTAS PARA ADMINISTRADORES ░░
// ══════════════════════════════════════════════

// Validar un pago
router.patch("/validar/:pago_id", authenticateJwt, isAdmin, validarPago);

// Ver historial de un usuario por RUT
router.get("/usuario/:rut/historial", authenticateJwt, isAdmin, obtenerHistorialPorRut);

// Listar todos los pagos para el historial general
router.get("/listar/historial", authenticateJwt, isAdmin, listarPagosAdmin);

// ══════════════════════════════════════════════
// ░░ RUTA DE PRECARGA (SOLO DESARROLLO) ░░
// ══════════════════════════════════════════════

if (process.env.NODE_ENV === "development") {
  router.post("/admin/precargar-pagos", authenticateJwt, isAdmin, async (req, res) => {
    try {
      const result = await createInitialPayments();
      if (result.success) {
        return res.status(201).json({ message: "Pagos precargados exitosamente" });
      }
      return res.status(500).json({ error: result.message });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
}

export default router;
