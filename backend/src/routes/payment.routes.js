"use strict";
import { Router } from "express";
import multer from "multer";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  actualizarPago,
  createInitialPayments, // Agregado para desarrollo
  eliminarPago,
  listarPagosAdmin,
  obtenerHistorialPorRut,
  obtenerPago,
  obtenerPagos,
  subirComprobante,
  validarPago,
} from "../controllers/payment.controller.js";

const router = Router();  
const upload = multer({ 
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB para el comprobante
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos PDF o imágenes"), false);
    }
  }
});

// Rutas para usuarios
router.post("/comprobante", authenticateJwt, upload.single("comprobante"), subirComprobante);
router.get("/mis-pagos", authenticateJwt, obtenerPagos);
router.get("/:id", authenticateJwt, obtenerPago);
router.patch("/actualizar/:id", authenticateJwt, actualizarPago);
router.delete("/eliminar/:id", authenticateJwt, eliminarPago);

// Rutas para administradores
router.patch("/validar/:id", authenticateJwt, isAdmin, validarPago); // es una de las dos o las dos para que funcione
//router.put("/validar/:id", authenticateJwt, isAdmin, validarPago);

router.get("/usuario/:rut/historial", authenticateJwt, isAdmin, obtenerHistorialPorRut);
router.get("/listar/historial", authenticateJwt, isAdmin, listarPagosAdmin);

// Ruta para desarrollo (precarga de datos) - Solo disponible en entorno de desarrollo
// Ruta para desarrollo (precarga de datos)
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

export default router;