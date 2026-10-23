import { crearError } from '../utils/errores.js';
import { obtenerArtesanosService, crearArtesanoService, obtenerArtesanoIdService, actualizarArtesanoService, eliminarArtesanoService } from '../services/artesano.service.js';

export const obtenerArtesanos = async (req, res, next) => {
    try {
        const filtrosDTO = req.queryValido;
        const respuesta = await obtenerArtesanosService(filtrosDTO);
        res.json(respuesta);
    } catch (error) {
        console.error(error);
        if (error.status || error.statusCode) return next(error);
        next(crearError('Error al obtener los artesanos', 500));
    }
};

export const obtenerArtesanoId = async (req, res, next) => {
    try {
        const id = req.id; 
        const artesano = await obtenerArtesanoIdService(id, req.usuario);
        res.json(artesano);
    } catch (error) {
        console.error(error);
        if (error.status || error.statusCode) return next(error);
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
        if (error.status || error.statusCode) return next(error);
        next(crearError('Error interno al crear el artesano', 500));
    }
};

export const actualizarArtesano = async (req, res, next) => {
    try {
        const id = req.id;
        const dataDTO = req.body;

        const artesanoActualizado = await actualizarArtesanoService(id, dataDTO, req.usuario);
        res.json(artesanoActualizado);
    } catch (error) {
        console.error(error);
        if (error.status || error.statusCode) return next(error);
        next(crearError('Error al actualizar el perfil del artesano', 500));
    }
};

export const eliminarArtesano = async (req, res, next) => {
    try {
        const id = req.id; 
        await eliminarArtesanoService(id);
         res.status(200).json({ mensaje: "Artesano eliminado correctamente" });
    } catch (error) {
        console.error(error);
        if (error.status || error.statusCode) return next(error);
        next(crearError('Error al eliminar el artesano', 500));
    }
};