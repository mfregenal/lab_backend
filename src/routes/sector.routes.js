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

 const router = Router();

 router.get('/',loggerConsultas,obtenerSectores);
 router.get('/:id',validarId,obtenerSectorPorId);
 router.post('/',validarSectorCreacion,crearSector);
 router.put('/:id',validarId,validarSectorActualizacion,actualizarSector);
 router.delete('/:id',validarId,eliminarSector);

 export default router;
