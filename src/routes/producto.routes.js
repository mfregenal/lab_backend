import express from 'express';
import { obtenerProductos,  obtenerProductoId, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/producto.controller.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";

const router = express.Router();

router.get('/', obtenerProductos);
router.get('/:id', validarId, obtenerProductoId);
router.post('/', crearProducto);
router.put('/:id', validarId, actualizarProducto);
router.delete('/:id', validarId, eliminarProducto);

export default router;