import express from 'express';
import { obtenerProductos,  obtenerProductoId, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/producto.controller.js';
import { validarCreacionProducto, validarConsultaProductos, validarActualizacionProducto } from '../middlewares/validarProductoMiddleware.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'
import { autenticarUsuario, autenticarUsuarioOpcional } from '../middlewares/autenticacion.middleware.js';
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js';

const router = express.Router();

router.get('/', autenticarUsuarioOpcional, loggerConsultas, validarConsultaProductos, obtenerProductos);
router.get('/:id', autenticarUsuarioOpcional, validarId, obtenerProductoId);
router.post('/', autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarCreacionProducto, crearProducto);
router.put('/:id', autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarId, validarActualizacionProducto, actualizarProducto);
router.delete('/:id', autenticarUsuario, autorizarRoles('ARTESANO', 'ADMINISTRADOR'), validarId, eliminarProducto);

export default router;