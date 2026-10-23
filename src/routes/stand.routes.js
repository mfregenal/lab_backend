import { Router } from "express";
import { obtenerStands, obtenerStandPorId, crearStand, actualizarStand, eliminarStand } from "../controllers/stand.controller.js";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarCreacionStand, validarConsultaStands, validarActualizacionStand } from "../middlewares/validarStandMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js';
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js';

const router = Router ();

router.get('/',loggerConsultas,validarConsultaStands,obtenerStands);
router.get('/:id',validarId,obtenerStandPorId);
router.post('/',autenticarUsuario,autorizarRoles('ADMINISTRADOR'),validarCreacionStand,crearStand);
router.put('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, validarActualizacionStand, actualizarStand);
router.delete('/:id',autenticarUsuario,autorizarRoles('ADMINISTRADOR'),validarId,eliminarStand);

export default router;