import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const obtenerProductosService = async (filtrosDTO, usuario) => {
    const { nombre, rubro, stand, std_producto, pagina, limite, ordenPor, direccion, artesanoId } = filtrosDTO;

    const condiciones = {};

    condiciones.std_producto = std_producto !== undefined ? std_producto : true;

    if (nombre) {
        condiciones.nom_producto = { contains: nombre, mode: 'insensitive' };
    }

    const filtroArtesano = {};

    if (usuario?.rol === 'ARTESANO') {
        const propio = await prisma.artesano.findUnique({ where: { usuarioId: usuario.id }, select: { id_artesano: true } });
        filtroArtesano.id_artesano = propio?.id_artesano ?? -1;
        
        if (artesanoId && artesanoId !== propio?.id_artesano) throw crearError('No puede consultar productos de otro artesano', 403);
    } else if (artesanoId) {
        filtroArtesano.id_artesano = artesanoId;
    }

    if (rubro) filtroArtesano.postulacion = { rubro: { nom_rubro: { contains: rubro, mode: 'insensitive' } } };

    if (stand) filtroArtesano.stand = { codigo: { contains: stand, mode: 'insensitive' } };

    if (Object.keys(filtroArtesano).length > 0) {
        condiciones.artesano = filtroArtesano;
    }

    const totalRegistros = await prisma.producto.count({ where: condiciones });
    const skip = (pagina - 1) * limite;

    const productos = await prisma.producto.findMany({
        where: condiciones,
        skip: skip,
        take: limite,
        orderBy: [{ [ordenPor]: direccion }, { id_producto: direccion }],
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
            pagina: pagina,
            limite: limite,
            totalPaginas: Math.ceil(totalRegistros / limite)
        }
    };
};

export const obtenerProductoIdService = async (id, usuario) => {
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

    if (!usuario && !producto.std_producto) {
        throw crearError(`No existe un producto con id ${id}`, 404);
    }

    if (usuario?.rol === 'ARTESANO' && producto.artesano.usuarioId !== usuario.id) {
        throw crearError(`No existe un producto con id ${id}`, 404);
    }

    return producto;
};

export const crearProductoService = async (dataDTO, usuario) => {
    let artesanoId = dataDTO.artesanoId;

    // Verificamos si el usuario es un artesano y si su postulación está aprobada
    if (usuario.rol === 'ARTESANO') {
        const artesano = await prisma.artesano.findUnique({
            where: { usuarioId: usuario.id },
            select: {
                id_artesano: true,
                postulacion: { select: { std_postulacion: true } }
            }
        });

        if (!artesano) throw crearError('No existe un perfil de artesano asociado a esta cuenta', 404)
        if (artesano.postulacion.std_postulacion !== 'APROBADA') {
            throw crearError('La postulación debe estar aprobada para gestionar productos', 403)
        }
        // Si el usuario es un artesano, usar su ID de artesano para crear el producto
        artesanoId = artesano.id_artesano;
    }

    if (!artesanoId) throw crearError('El ID del artesano es obligatorio', 400)

    const artesanoExiste = await prisma.artesano.findUnique({
        where: { id_artesano: artesanoId },
        select: { id_artesano: true }
    });

    if (!artesanoExiste) {
        throw crearError(`El artesano con ID ${artesanoId} no existe.`, 404);
    }

    const nuevoProducto = await prisma.producto.create({
        data: { ...dataDTO, artesanoId }
    });

    return nuevoProducto;
};

export const actualizarProductoService = async (id, dataDTO, usuario) => {
    try {
        // Verificamos que el producto pertenece al artesano y que la postulación está aprobada
        if (usuario.rol === 'ARTESANO') {
            const producto = await prisma.producto.findUnique({
                where: { id_producto: id },
                select: {
                    artesano: {
                        select: {
                            usuarioId: true,
                            postulacion: { select: { std_postulacion: true } }
                        }
                    }
                }
            });

            if (!producto || producto.artesano.usuarioId !== usuario.id) {
                throw crearError(`No existe un producto con id ${id}`, 404);
            }

            if (producto.artesano.postulacion.std_postulacion !== 'APROBADA') {
                throw crearError('La postulación debe estar aprobada para gestionar productos', 403)
            }
        }

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

export const eliminarProductoService = async (id, usuario) => {
    try {
        // Verificamos si el usuario es un artesano y si su postulación está aprobada
        if (usuario.rol === 'ARTESANO') {
            const producto = await prisma.producto.findUnique({
                where: { id_producto: id },
                select: {
                    artesano: {
                        select: {
                            usuarioId: true,
                            postulacion: { select: { std_postulacion: true } }
                        }
                    }
                }
            });

            if (!producto || producto.artesano.usuarioId !== usuario.id) {
                throw crearError(`No existe un producto con id ${id}`, 404);
            }
            if (producto.artesano.postulacion.std_postulacion !== 'APROBADA') {
                throw crearError('La postulación debe estar aprobada para gestionar productos', 403)
            }
        }

        await prisma.producto.delete({ where: { id_producto: id } });
    } catch (error) {
        if (error.status || error.statusCode) throw error
        if (error.code === 'P2025') {
            throw crearError(`No existe un producto con id ${id}`, 404);
        }
        throw error;
    }
};