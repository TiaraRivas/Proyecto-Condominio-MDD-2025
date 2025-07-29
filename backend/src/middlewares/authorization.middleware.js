import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
handleErrorClient,
handleErrorServer,
} from "../handlers/responseHandlers.js";



export const isAdmin = async (req, res, next) => {
  try {
    const idUsuario = req.user?.id;

    if (!idUsuario) {
      return res.status(401).json({
        status: "Client error",
        message: "Usuario no autenticado",
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ id: idUsuario });

    const rolUser = userFound?.rol?.toLowerCase();

    if (rolUser !== "administrador") {
      return res.status(403).json({
        status: "Client error",
        message: "Solo los administradores pueden listar todos los pagos",
        details: {},
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Server error",
      message: "Error al verificar rol de administrador",
    });
  }
};


/*export async function isAdmin(req, res, next) {
try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
    return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos",
    );
    }

    const rolUser = userFound.rol;

    if (rolUser !== "administrador") {
        return handleErrorClient(
            res,
            403,
            "Error al acceder al recurso",
            "Se requiere un rol de administrador para realizar esta acción."
        );
    }
    next();
} catch (error) {
    handleErrorServer(
    res,
    500,
    error.message,
    );
}
}*/