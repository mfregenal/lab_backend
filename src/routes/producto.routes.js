import express from 'express';
import { obtenerProductos,  obtenerProductoId, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/producto.controller.js';
import { validarCreacionProducto, validarConsultaProductos } from '../middlewares/validarProductoMiddleware.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'

const router = express.Router();

router.get('/', loggerConsultas, validarConsultaProductos, obtenerProductos);
router.get('/:id', validarId, obtenerProductoId);
router.post('/', validarCreacionProducto, crearProducto);
router.put('/:id', validarId, actualizarProducto);
router.delete('/:id', validarId, eliminarProducto);

export default router;