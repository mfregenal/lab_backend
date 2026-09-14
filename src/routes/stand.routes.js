import { Router } from "express";
import { obtenerStands, obtenerStandPorId, crearStand, actualizarStand, eliminarStand } from "../controllers/stand.controller";
import { validarId } from "../middlewares/validarId";

const router = Router ();

router.get('/',obtenerStands);
router.get('/:id',validarId,obtenerStandPorId);
router.post('/',crearStand);
router.put('/:id', validarId, actualizarStand);
router.delete('/:id',validarId,eliminarStand);

export default router;