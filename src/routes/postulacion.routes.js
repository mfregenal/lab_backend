import express from 'express';
import { obtenerPostulaciones, obtenerPostulacionId,/* crearPostulacion */ actualizarPostulacion, eliminarPostulacion } from '../controllers/postulacion.controller.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarActualizacionPostulacion,/* validarCreacionPostulacion */ validarConsultaPostulaciones, validarEvaluacionPostulacion } from "../middlewares/validarPostulacionMiddleware.js";


const router = express.Router();


router.get('/', validarConsultaPostulaciones, obtenerPostulaciones);
router.get('/:id', validarId, obtenerPostulacionId);
// router.post('/', validarCreacionPostulacion, crearPostulacion);
router.put('/:id', validarId, validarActualizacionPostulacion, actualizarPostulacion);
router.put('/:id/evaluar', validarId, validarEvaluacionPostulacion, actualizarPostulacion);
router.delete('/:id', validarId, eliminarPostulacion);


export default router;
