import { crearError } from '../utils/errores.js'
import prisma from '../config/prisma.js';
import { obtenerArtesanosService, crearArtesanoService } from '../services/artesano.service.js';

export const obtenerArtesanos = async (req, res, next) => {
    try {
   
        const filtrosDTO = req.query;

        const artesanos = await obtenerArtesanosService(filtrosDTO);
        
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

        const artesanoDTO = req.body;

        const nuevoArtesano = await crearArtesanoService(artesanoDTO);

        res.status(201).json(nuevoArtesano);
    } catch (error) {
        console.error(error);
        
        if (error.statusCode) {
            return next(error);
        }
        
        next(crearError('Error interno al crear el artesano', 500));
    }
};

export const actualizarArtesano = async (req, res, next) => {
    try {
        const id = req.id;
        const { rubroID, nom_emprend, trayectoria, localidad } = req.body;

        const artesanoActualizado = await prisma.artesano.update({
            where: { id_artesano: id },
            data: {
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
        const id = req.id; 
        
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