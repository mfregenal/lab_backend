import { Router } from "express";
import { validarId } from "../middlewares/validarIdMiddleware";
import { obtenerSectores,
    obtenerSectorPorId,
    crearSector,
    actualizarSector,
    eliminarSector,
 } from "../controllers/sector.controller";

 const router = Router();

 router.get('/',obtenerSectores);
 router.get('/:id',validarId,obtenerSectorPorId);
 router.post('/',crearSector);
 router.put('/:id',validarId,actualizarSector);
 router.delete('/:id',validarId,eliminarSector);

 export default router;
