import express from 'express';
import { obtenerPostulaciones, obtenerPostulacionId,/* crearPostulacion */ actualizarPostulacion, eliminarPostulacion } from '../controllers/postulacion.controller.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarActualizacionPostulacion, validarConsultaPostulaciones, validarEvaluacionPostulacion } from "../middlewares/validarPostulacionMiddleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware.js";

const router = express.Router();


router.get('/', autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarConsultaPostulaciones, obtenerPostulaciones);
router.get('/:id', autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarId, obtenerPostulacionId);
router.put('/:id', autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarId, validarActualizacionPostulacion, actualizarPostulacion);
router.put('/:id/evaluar', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, validarEvaluacionPostulacion, actualizarPostulacion);
router.delete('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, eliminarPostulacion);


export default router;