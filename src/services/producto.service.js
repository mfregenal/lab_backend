import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const obtenerProductosService = async (filtrosDTO) => {
    const { nombre, rubro, stand, std_producto, pagina, limite } = filtrosDTO;

    const condiciones = {};

    condiciones.std_producto = std_producto !== undefined ? std_producto : true;

    if (nombre) {
        condiciones.nom_producto = { contains: nombre, mode: 'insensitive' };
    }

    if (rubro || stand) {
        condiciones.artesano = {};   
        
        if (rubro) {
            condiciones.artesano.postulacion = {
                rubro: { nom_rubro: { contains: rubro, mode: 'insensitive' } }
            };
        }
        if (stand) {
            condiciones.artesano.stand = {
                codigo: { contains: stand, mode: 'insensitive' }
            };
        }
    }

    const totalRegistros = await prisma.producto.count({ where: condiciones });
    const skip = (pagina - 1) * limite;

    const productos = await prisma.producto.findMany({
        where: condiciones,
        skip: skip,
        take: limite,
        include: {
            artesano: {
                include: {
                    usuario: { select: { nombre: true, apellido: true } },
                    postulacion: { select: { nom_emprend: true, rubro: true } },
                    stand: { select: { codigo: true } }
                }
            }
        }
    });

    return {
        data: productos,
        meta: {
            total: totalRegistros,
            page: pagina,
            limit: limite,
            totalPages: Math.ceil(totalRegistros / limite)
        }
    };
};

export const obtenerProductoIdService = async (id) => {
    const producto = await prisma.producto.findUnique({
        where: { id_producto: id },
        include: {
            artesano: {
                include: {
                    usuario: { select: { nombre: true, apellido: true } },
                    stand: { select: { codigo: true } }
                }
            }
        }
    });

    if (!producto) {
        throw crearError(`No existe un producto con id ${id}`, 404);
    }
    return producto;
};

export const crearProductoService = async (dataDTO) => {
    const artesanoExiste = await prisma.artesano.findUnique({
        where: { id_artesano: dataDTO.artesanoId }
    });

    if (!artesanoExiste) {
        throw crearError(`El artesano con ID ${dataDTO.artesanoId} no existe.`, 404);
    }

    const nuevoProducto = await prisma.producto.create({ data: dataDTO });
    return nuevoProducto;
};

export const actualizarProductoService = async (id, dataDTO) => {
    try {
        const productoActualizado = await prisma.producto.update({
            where: { id_producto: id },
            data: dataDTO
        });
        return productoActualizado;
    } catch (error) {
        if (error.code === 'P2025') {
            throw crearError(`No existe un producto con id ${id}`, 404);
        }
        throw error;
    }
};

export const eliminarProductoService = async (id) => {
    try {
        await prisma.producto.delete({ where: { id_producto: id } });
    } catch (error) {
        if (error.code === 'P2025') {
            throw crearError(`No existe un producto con id ${id}`, 404);
        }
        throw error;
    }
};