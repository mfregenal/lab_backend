import { Router } from "express";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { obtenerSectores,
    obtenerSectorPorId,
    crearSector,
    actualizarSector,
    eliminarSector,
 } from "../controllers/sector.controller.js";

 const router = Router();

 router.get('/',obtenerSectores);
 router.get('/:id',validarId,obtenerSectorPorId);
 router.post('/',crearSector);
 router.put('/:id',validarId,actualizarSector);
 router.delete('/:id',validarId,eliminarSector);

 export default router;
