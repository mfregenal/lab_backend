import express from 'express';
import { obtenerPostulaciones, obtenerPostulacionId, crearPostulacion,  eliminarPostulacion } from '../controllers/postulacion.controller.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarCreacionPostulacion, validarConsultaPostulaciones} from "../middlewares/validarPostulacionMiddleware.js";

const router = express.Router();

router.get('/', validarConsultaPostulaciones, obtenerPostulaciones);
router.get('/:id', validarId, obtenerPostulacionId);
router.post('/', validarCreacionPostulacion, crearPostulacion);
router.put('/:id', validarId);
router.put('/:id/evaluar', validarId);
router.delete('/:id', validarId, eliminarPostulacion);

export default router;
