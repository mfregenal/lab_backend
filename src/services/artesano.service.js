import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const obtenerArtesanosService = async (filtrosDTO) => {
    const { nombre, apellido, rubro, stand, page, limit } = filtrosDTO;

    const condiciones = {};

    if (nombre || apellido) {
        condiciones.usuario = {};
        if (nombre) condiciones.usuario.nombre = { contains: nombre, mode: 'insensitive' };
        if (apellido) condiciones.usuario.apellido = { contains: apellido, mode: 'insensitive' };
    }

    if (rubro) {
        condiciones.postulacion = {
            rubro: { nom_rubro: { contains: rubro, mode: 'insensitive' } }
        };
    }

    if (stand) {
        condiciones.stand = { codigo: { contains: stand, mode: 'insensitive' } };
    }

    const totalRegistros = await prisma.artesano.count({ where: condiciones });
    const skip = (page - 1) * limit;

    const artesanos = await prisma.artesano.findMany({
        where: condiciones,
        skip: skip,
        take: limit,
        include: {
            usuario: { select: { nombre: true, apellido: true, email: true } },
            postulacion: { 
                select: { nom_emprend: true, localidad: true, provincia: true, rubro: true }
            },
            stand: { select: { codigo: true } }
        }
    });

    return {
        data: artesanos,
        meta: {
            total: totalRegistros,
            page,
            limit,
            totalPages: Math.ceil(totalRegistros / limit)
        }
    };
};

export const obtenerArtesanoIdService = async (id) => {
    const artesano = await prisma.artesano.findUnique({
        where: { id_artesano: id },
        include: {
            usuario: { select: { nombre: true, apellido: true, email: true } },
            postulacion: { include: { rubro: true } },
            stand: true
        }
    });

    if (!artesano) {
        throw crearError(`No existe un artesano con id ${id}`, 404);
    }
    return artesano;
};

export const crearArtesanoService = async (dataDTO) => {
    const usuarioExiste = await prisma.usuario.findUnique({
        where: { id_usuario: dataDTO.usuarioId }
    });
    if (!usuarioExiste) {
        throw crearError(`El usuario con ID ${dataDTO.usuarioId} no existe.`, 404);
    }

    const postulacionExiste = await prisma.postulacion.findUnique({
        where: { id_postulacion: dataDTO.postulacionId }
    });
    if (!postulacionExiste) {
        throw crearError(`La postulación con ID ${dataDTO.postulacionId} no existe.`, 404);
    }

    const nuevoArtesano = await prisma.artesano.create({ data: dataDTO });
    return nuevoArtesano;
};

export const actualizarArtesanoService = async (id, dataDTO) => {
    try {
        const { nom_emprend, trayectoria, localidad, standId } = dataDTO;

        const artesanoActualizado = await prisma.artesano.update({
            where: { id_artesano: id },
            data: {
                standId: standId ? Number(standId) : undefined, 
                // Actualizamos los datos heredados en la postulación
                postulacion: {
                    update: { nom_emprend, trayectoria, localidad }
                }
            },
            include: {
                postulacion: { include: { rubro: true } },
                stand: true
            }
        });

        return artesanoActualizado;
    } catch (error) {
        if (error.code === 'P2025') {
            throw crearError(`No existe un artesano con id ${id}`, 404);
        }
        throw error;
    }
};

export const eliminarArtesanoService = async (id) => {
    try {
        await prisma.artesano.delete({ where: { id_artesano: id } });
    } catch (error) {
        if (error.code === 'P2025') {
            throw crearError(`No existe un artesano con id ${id}`, 404);
        }
        throw error;
    }
};