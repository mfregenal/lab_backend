import { Router } from "express";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { obtenerSectores,
    obtenerSectorPorId,
    crearSector,
    actualizarSector,
    eliminarSector,
 } from "../controllers/sector.controller.js";
 import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'
 import { validarSectorCreacion } from "../middlewares/validarCreacionSectorMiddleware.js";
 import { validarSectorActualizacion } from "../middlewares/validarActualizacionSectorMiddleware.js";
 import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
 import { autorizarRoles } from "../middlewares/autorizacion.middleware.js";

 const router = Router();

 router.get('/',loggerConsultas,obtenerSectores);
 router.get('/:id',validarId,obtenerSectorPorId);
 router.post('/',autenticarUsuario,autorizarRoles('ADMINISTRADOR'),validarSectorCreacion,crearSector);
 router.put('/:id',autenticarUsuario,autorizarRoles('ADMINISTRADOR'),validarId,validarSectorActualizacion,actualizarSector);
 router.delete('/:id',autenticarUsuario,autorizarRoles('ADMINISTRADOR'),validarId,eliminarSector);

 export default router;
