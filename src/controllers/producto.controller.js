import { crearError } from '../utils/errores.js';
import {obtenerProductosService, crearProductoService, obtenerProductoIdService, actualizarProductoService, eliminarProductoService
} from '../services/producto.service.js';

export const obtenerProductos = async (req, res, next) => {
  try {
    const filtrosDTO = req.queryValido;
    const respuesta = await obtenerProductosService(filtrosDTO, req.usuario);
    res.json(respuesta);
  } catch (error) {
    console.error(error);
    if (error.status || error.statusCode) return next(error);
    next(crearError('Error al obtener los productos', 500));
  }
};;

export const obtenerProductoId = async (req, res, next) => {
  try {
    const id = req.id;
    const producto = await obtenerProductoIdService(id, req.usuario);
    res.json(producto);
  } catch (error) {
    console.error(error);
    if (error.status || error.statusCode) return next(error);
    next(crearError('Error al buscar el producto', 500));
  }
};

export const crearProducto = async (req, res, next) => {
  try {
    const productoDTO = req.body;
    const nuevoProducto = await crearProductoService(productoDTO, req.usuario);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    if (error.status || error.statusCode) return next(error);
    next(crearError('Error interno al crear el producto', 500));
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const id = req.id;
    const dataDTO = req.body;

    const productoActualizado = await actualizarProductoService(id, dataDTO, req.usuario);
    res.json(productoActualizado);
  } catch (error) {
    console.error(error);
    if (error.status || error.statusCode) return next(error);
    next(crearError('Error al actualizar el producto', 500));
  }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    const id = req.id;
    await eliminarProductoService(id, req.usuario);
    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    if (error.status || error.statusCode) return next(error);
    next(crearError('Error al eliminar el producto', 500));
  }
};