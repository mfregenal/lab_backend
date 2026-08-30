import express from 'express';
import { obtenerProductos, obtenerProductosFiltrados, obtenerProductosporId, crearProducto, eliminarProducto } from '../controllers/productos.controller.js';

const router = express.Router();

router.get('/', obtenerProductos);
router.get('/filtrados', obtenerProductosFiltrados);
router.get('/:id', obtenerProductosporId);
router.post('/', crearProducto);
router.delete('/:id', eliminarProducto);

export default router;