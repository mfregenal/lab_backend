import express from 'express';
import {
  obtenerArtesanos,
  obtenerArtesanoId,
  crearArtesano,
  actualizarArtesano,
  eliminarArtesano
} from '../controllers/artesano.controller.js';
import { validarCreacionArtesano, validarConsultaArtesanos } from '../middlewares/validarArtesanoMiddleware.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js';
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js';

const router = express.Router();

router.get('/', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), loggerConsultas, validarConsultaArtesanos, obtenerArtesanos);
router.get('/:id', autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarId, obtenerArtesanoId);
router.post('/', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarCreacionArtesano, crearArtesano);
router.put('/:id', autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarId, actualizarArtesano);
router.delete('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, eliminarArtesano);

export default router;