import { Router } from "express";
import { obtenerPabellones,obtenerPabellonPorId,eliminarPabellon,crearPabellon,actualizarPabellon } from "../controllers/pabellon.controller.js";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarPabellonCreacion } from "../middlewares/validarCreacionPabellonMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'
import { validarPabellonActualizacion } from "../middlewares/validarActualizacionPabellonMiddleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware.js";

const router = Router ();

router.get('/',loggerConsultas,obtenerPabellones);
router.get('/:id',validarId,obtenerPabellonPorId);
router.post('/',autenticarUsuario,autorizarRoles('ADMINISTRADOR'),validarPabellonCreacion, crearPabellon);
router.put('/:id',autenticarUsuario,autorizarRoles('ADMINISTRADOR'),validarId, validarPabellonActualizacion, actualizarPabellon);
router.delete('/:id',autenticarUsuario,autorizarRoles('ADMINISTRADOR'),validarId,eliminarPabellon);

export default router;