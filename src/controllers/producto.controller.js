import { crearError } from '../utils/errores.js';
import { obtenerProductosService, crearProductoService } from '../services/producto.service.js';


export const obtenerProductos = async (req, res, next) => {
    try {
       
        const filtrosDTO = req.query;

        const productos = await obtenerProductosService(filtrosDTO);
        
        res.json(productos);
    } catch (error) {
        console.error(error);
        next(crearError('Error al obtener los productos', 500));
    }
};


export const obtenerProductoId = async (req, res, next) => {
    try {
        const id = req.id;
        const producto = await prisma.producto.findUnique({
            where: { id_producto: id },
            include: {
                artesano: {
                    select: { id_artesano: true }
                }
            }
        });

        if (!producto) {
            return next(crearError(`No existe un producto con id ${id}`, 404));
        }

        res.json(producto);
    } catch (error) {
        console.error(error);
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
        
        if (error.statusCode) {
            return next(error);
        }
        
        next(crearError('Error interno al crear el producto', 500));
    }
};

export const actualizarProducto = async (req, res, next) => {
    try {
        const id = req.id;
        const { nom_producto, desc_producto, precio, std_producto } = req.body;

        const productoActualizado = await prisma.producto.update({
            where: { id_producto: id },
            data: {
                nom_producto,
                desc_producto,
                precio,
                std_producto
            }
        });

        res.json(productoActualizado);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return next(crearError(`No existe un producto con id ${req.params.id}`, 404));
        }
        next(crearError('Error al actualizar el producto', 500));
    }
};

export const eliminarProducto = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        await prisma.producto.delete({
            where: { id_producto: id }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return next(crearError(`No existe un producto con id ${req.params.id}`, 404));
        }
        next(crearError('Error al eliminar el producto', 500));
    }
};