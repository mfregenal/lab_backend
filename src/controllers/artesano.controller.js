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
        const id = req.id; 

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
        // Asegurate de mandar estos datos en Postman exactamente con esta capitalización (terminados en ID)
        const { usuarioID, postulacionID, rubroID } = req.body;

        if (!usuarioID || !postulacionID || !rubroID) {
            return next(crearError('Faltan datos obligatorios (usuarioID, postulacionID, rubroID)', 400));
        }

        const nuevoArtesano = await prisma.artesano.create({
            data: {
                usuarioID: Number(usuarioID),
                postulacionID: Number(postulacionID),
                rubroID: Number(rubroID)
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
        const id = req.id;
        const { rubroID, nom_emprend, trayectoria, localidad } = req.body;

        const artesanoActualizado = await prisma.artesano.update({
            where: { id_artesano: id },
            data: {
                // Actualizado a rubroID mayúscula
                rubroID: rubroID ? Number(rubroID) : undefined, 
                
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
            return next(crearError(`No existe un artesano con id ${req.id}`, 404));
        }
        next(crearError('Error al actualizar el perfil del artesano', 500));
    }
};

export const eliminarArtesano = async (req, res, next) => {
    try {
        const id = req.id; // Actualizado al ID limpio del middleware

        await prisma.artesano.delete({
            where: { id_artesano: id }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return next(crearError(`No existe un artesano con id ${req.id}`, 404));
        }
        next(crearError('Error al eliminar el artesano', 500));
    }
};