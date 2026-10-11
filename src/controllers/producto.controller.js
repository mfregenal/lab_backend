import { crearError } from '../utils/errores.js';
import { 
    obtenerProductosService, 
    crearProductoService,
    obtenerProductoIdService,
    actualizarProductoService,
    eliminarProductoService
} from '../services/producto.service.js';

export const obtenerProductos = async (req, res, next) => {
    try {
        const filtrosDTO = req.query;
        const respuesta = await obtenerProductosService(filtrosDTO);
        res.json(respuesta);
    } catch (error) {
        console.error(error);
        next(crearError('Error al obtener los productos', 500));
    }
};

export const obtenerProductoId = async (req, res, next) => {
    try {
        const id = req.id;
        const producto = await obtenerProductoIdService(id);
        res.json(producto);
    } catch (error) {
        console.error(error);
        if (error.statusCode) return next(error);
        next(crearError('Error al buscar el producto', 500));
    }
};

export const crearProducto = async (req, res, next) => {
    try {
        const productoDTO = req.body;
        const nuevoProducto = await crearProductoService(productoDTO);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error(error);
        if (error.statusCode) return next(error);
        next(crearError('Error interno al crear el producto', 500));
    }
};

export const actualizarProducto = async (req, res, next) => {
    try {
        const id = req.id;
        const dataDTO = req.body;

        const productoActualizado = await actualizarProductoService(id, dataDTO);
        res.json(productoActualizado);
    } catch (error) {
        console.error(error);
        if (error.statusCode) return next(error);
        next(crearError('Error al actualizar el producto', 500));
    }
};

export const eliminarProducto = async (req, res, next) => {
    try {
        const id = req.id; // Asumiendo que usas tu middleware validarIdMiddleware
        await eliminarProductoService(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        if (error.statusCode) return next(error);
        next(crearError('Error al eliminar el producto', 500));
    }
};