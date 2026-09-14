import express from 'express';
import { obtenerProductos,  obtenerProductoId, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/producto.controller.js';

const router = express.Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoId);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

export default router;