import { Router } from "express";
import { obtenerPabellones,obtenerPabellonPorId,eliminarPabellon,crearPabellon,actualizarPabellon } from "../controllers/pabellon.controller";
import { validarId } from "../middlewares/validarId";

const router = Router ();

router.get('/',obtenerPabellones);
router.get('/:id',validarId,obtenerPabellonPorId);
router.post('/',crearPabellon);
router.put('/:id', validarId, actualizarPabellon);
router.delete('/:id',validarId,eliminarPabellon);

export default router;