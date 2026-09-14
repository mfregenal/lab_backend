import { Router } from "express";
import { obtenerPabellones,obtenerPabellonPorId,eliminarPabellon,crearPabellon,actualizarPabellon } from "../controllers/pabellon.controller.js";
import { validarId } from "../middlewares/validarIdMiddleware.js";

const router = Router ();

router.get('/',obtenerPabellones);
router.get('/:id',validarId,obtenerPabellonPorId);
router.post('/',crearPabellon);
router.put('/:id', validarId, actualizarPabellon);
router.delete('/:id',validarId,eliminarPabellon);

export default router;