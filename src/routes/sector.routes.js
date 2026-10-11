import { Router } from "express";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { obtenerSectores,
    obtenerSectorPorId,
    crearSector,
    actualizarSector,
    eliminarSector,
 } from "../controllers/sector.controller.js";
 import { validarSectorCreacion } from "../middlewares/validarCreacionSectorMiddleware.js";
 import { validarSectorActualizacion } from "../middlewares/validarActualizacionSectorMiddleware.js";

 const router = Router();

 router.get('/',obtenerSectores);
 router.get('/:id',validarId,obtenerSectorPorId);
 router.post('/',validarSectorCreacion,crearSector);
 router.put('/:id',validarId,validarSectorActualizacion,actualizarSector);
 router.delete('/:id',validarId,eliminarSector);

 export default router;
