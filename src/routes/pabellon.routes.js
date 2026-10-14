import { Router } from "express";
import { obtenerPabellones,obtenerPabellonPorId,eliminarPabellon,crearPabellon,actualizarPabellon } from "../controllers/pabellon.controller.js";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarPabellonCreacion } from "../middlewares/validarCreacionPabellonMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'

const router = Router ();

router.get('/',loggerConsultas,obtenerPabellones);
router.get('/:id',validarId,obtenerPabellonPorId);
router.post('/',validarPabellonCreacion, crearPabellon);
router.put('/:id', validarId, actualizarPabellon);
router.delete('/:id',validarId,eliminarPabellon);

export default router;