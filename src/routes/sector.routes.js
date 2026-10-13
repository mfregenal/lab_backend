import { Router } from "express";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { obtenerSectores,
    obtenerSectorPorId,
    crearSector,
    actualizarSector,
    eliminarSector,
 } from "../controllers/sector.controller.js";
 import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'

 const router = Router();

 router.get('/',loggerConsultas,obtenerSectores);
 router.get('/:id',validarId,obtenerSectorPorId);
 router.post('/',crearSector);
 router.put('/:id',validarId,actualizarSector);
 router.delete('/:id',validarId,eliminarSector);

 export default router;
