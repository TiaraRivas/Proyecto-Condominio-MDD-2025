"use strict";
import { Router } from "express";
import multer from "multer";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { actualizarPago, eliminarPago, obtenerPago, obtenerPagos, subirComprobante, validarPago } 
from "../controllers/payment.controller.js";

const router = Router();  
const upload = multer({ dest: "uploads/" });

// Ruta para que usuarios autenticados suban comprobantes
router.post("/upload", authenticateJwt, upload.single("receipt"), subirComprobante);

// Ruta para que solo administradores validen pagos
router.post("/validate", authenticateJwt, isAdmin, validarPago);

// CRUD pagos

router.get("/", authenticateJwt, obtenerPagos);
router.get("/:id", authenticateJwt, obtenerPago);
router.patch("/:id", authenticateJwt, actualizarPago);
router.delete("/:id", authenticateJwt, eliminarPago);

export default router;
