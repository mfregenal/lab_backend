import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const obtenerPostulacionesService = async (filtrosDTO, usuario) => {
    const { estado, nombre, dni, provincia, localidad, pagina, limite} = filtrosDTO;

    const condiciones = {};

    if (estado) {
        condiciones.std_postulacion = estado;
    }
    if (nombre) {
        condiciones.nom_emprend = { contains: nombre, mode: 'insensitive' };
    }
    if (dni) {
        condiciones.dni = { contains: dni };
    }
    if (provincia) {
        condiciones.provincia = { contains: provincia, mode: 'insensitive' };
    }
    if (localidad) {
        condiciones.localidad = { contains: localidad, mode: 'insensitive' };
    }

    // Si el usuario es un ARTESANO, solo puede ver sus propias postulaciones
    if (usuario.rol === 'ARTESANO') {
        condiciones.usuarioId = usuario.id;
    }

    const totalRegistros = await prisma.postulacion.count({
        where: condiciones
    });

    const skip = (pagina - 1) * limite;

    const postulaciones = await prisma.postulacion.findMany({
        where: condiciones,
        skip: skip,
        take: limite,
        include: {
            usuario: { select: { nombre: true, apellido: true, email: true } },
            rubro: { select: { nom_rubro: true } },
            admin: { select: { nombre: true, apellido: true } }
        }
    });

    return {
        data: postulaciones,
        meta: {
            total: totalRegistros,
            pagina: pagina,
            limite: limite,
            totalPaginas: Math.ceil(totalRegistros / limite)
        }
    };
};


export const obtenerPostulacionIdService = async (id, usuario) => {
    const postulacion = await prisma.postulacion.findUnique({
        where: { id_postulacion: id },
        include: {
            usuario: { select: { nombre: true, apellido: true, email: true } },
            rubro: true
        }
    });

    if (!postulacion) {
        throw crearError(`No existe una postulación con id ${id}`, 404);
    }

    if (usuario.rol === 'ARTESANO' && postulacion.usuarioId !== usuario.id) {
        throw crearError(`No existe una postulación con id ${id}`, 404);
    }

    return postulacion;
};


export const actualizarPostulacionService = async (id, dataDTO, usuario) => {
    try {
        return await prisma.$transaction(async (tx) => {
            const postulacion = await tx.postulacion.findUnique({
                where: { id_postulacion: id },
                include: { artesano: true }
            });

            if (!postulacion) throw crearError(`No existe una postulación con id ${id}`, 404);

            if (usuario.rol === 'ARTESANO') {
                if (postulacion.usuarioId !== usuario.id) {
                    throw crearError(`No existe una postulación con id ${id}`, 404);
                }
                if (postulacion.std_postulacion !== 'REVISION_REQUERIDA') {
                    throw crearError('Solo puede modificar la postulación cuando se solicitaron cambios', 403);
                }

                const actualizada = await tx.postulacion.update({
                    where: { id_postulacion: id },
                    data: { ...dataDTO, std_postulacion: 'PENDIENTE', observacion: null }
                });
                return actualizada;
            }

            const estado = dataDTO.std_postulacion;
            if (estado === undefined) {
                return tx.postulacion.update({
                    where: { id_postulacion: id },
                    data: dataDTO
                });
            }
            if (postulacion.artesano && estado !== 'APROBADA') {
                throw crearError('Una postulación aprobada no puede volver a un estado anterior', 409);
            }
            if (estado === 'APROBADA' && !postulacion.artesano) {
                await tx.artesano.create({
                    data: { usuarioId: postulacion.usuarioId, postulacionId: id }
                });
            }

            return tx.postulacion.update({
                where: { id_postulacion: id },
                data: {
                    std_postulacion: estado,
                    observacion: dataDTO.observacion,
                    adminId: usuario.id
                },
                include: { artesano: true }
            });
        });
    } catch (error) {
        if (error.status || error.statusCode) throw error;
        if (error.code === 'P2025') {
            throw crearError(`No existe una postulación con id ${id}`, 404);
        }
        if (error.code === 'P2002') {
            throw crearError('Ya existe otra postulación registrada con ese DNI', 400);
        }
        throw error;
    }
};


export const eliminarPostulacionService = async (id) => {
    try {
        await prisma.postulacion.delete({
            where: { id_postulacion: id }
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw crearError(`No existe una postulación con id ${id}`, 404);
        }
        throw error;
    }
};