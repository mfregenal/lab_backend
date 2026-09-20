import { Router } from "express";
import { obtenerStands, obtenerStandPorId, crearStand, actualizarStand, eliminarStand } from "../controllers/stand.controller.js";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarCreacionStand, validarConsultaStands } from "../middlewares/standMiddleware.js";

const router = Router ();

router.get('/',validarConsultaStands,obtenerStands);
router.get('/:id',validarId,obtenerStandPorId);
router.post('/',validarCreacionStand,crearStand);
router.put('/:id', validarId, actualizarStand);
router.delete('/:id',validarId,eliminarStand);

export default router;