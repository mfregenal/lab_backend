import { Router } from "express";
import { obtenerStands, obtenerStandPorId, crearStand, actualizarStand, eliminarStand } from "../controllers/stand.controller.js";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarCreacionStand, validarConsultaStands, validarActualizacionStand } from "../middlewares/validarStandMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'

const router = Router ();

router.get('/',loggerConsultas,validarConsultaStands,obtenerStands);
router.get('/:id',validarId,obtenerStandPorId);
router.post('/',validarCreacionStand,crearStand);
router.put('/:id', validarId, validarActualizacionStand, actualizarStand);
router.delete('/:id',validarId,eliminarStand);

export default router;