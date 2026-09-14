import { crearError } from '../utils/errores.js'
import prisma from '../config/prisma.js';

export const obtenerArtesanos = async (req, res, next) => {
    try {
        const artesanos = await prisma.artesano.findMany({
            include: {
                postulacion: {
                    select: { nom_emprend: true, localidad: true, provincia: true }
                },
                rubro: {
                    select: { nom_rubro: true }
                },
                usuario: {
                    select: { nombre: true, apellido: true }
                }
            }
        });
        res.json(artesanos);
    } catch (error) {
        console.error(error);
        next(crearError('Error al obtener los artesanos', 500));
    }
};

export const obtenerArtesanoId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const artesano = await prisma.artesano.findUnique({
            where: { id_artesano: id },
            include: {
                postulacion: true,
                rubro: true,
                usuario: { select: { nombre: true, apellido: true, email: true } }
            }
        });

        if (!artesano) {
            return next(crearError(`No existe un artesano con id ${id}`, 404));
        }

        res.json(artesano);
    } catch (error) {
        console.error(error);
        next(crearError('Error al buscar el artesano', 500));
    }
};

export const crearArtesano = async (req, res, next) => {
    try {
        const { usuarioId, postulacionId, rubroId } = req.body;

        if (!usuarioId || !postulacionId || !rubroId) {
            return next(crearError('Faltan datos obligatorios (usuarioId, postulacionId, rubroId)', 400));
        }

        const nuevoArtesano = await prisma.artesano.create({
            data: {
                usuarioId: Number(usuarioId),
                postulacionId: Number(postulacionId),
                rubroId: Number(rubroId)
            }
        });

        res.status(201).json(nuevoArtesano);
    } catch (error) {
        console.error(error);
        next(crearError('Error al crear el artesano', 500));
    }
};

export const actualizarArtesano = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const { rubroId, nom_emprend, trayectoria, localidad } = req.body;

        const artesanoActualizado = await prisma.artesano.update({
            where: { id_artesano: id },
            data: {
                rubroId: rubroId ? Number(rubroId) : undefined,
                
                postulacion: {
                    update: {
                        nom_emprend,
                        trayectoria,
                        localidad
                    }
                }
            },
            include: {
                postulacion: true,
                rubro: true
            }
        });

        res.json(artesanoActualizado);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return next(crearError(`No existe un artesano con id ${req.params.id}`, 404));
        }
        next(crearError('Error al actualizar el perfil del artesano', 500));
    }
};

export const eliminarArtesano = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        await prisma.artesano.delete({
            where: { id_artesano: id }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return next(crearError(`No existe un artesano con id ${req.params.id}`, 404));
        }
        next(crearError('Error al eliminar el artesano', 500));
    }
};