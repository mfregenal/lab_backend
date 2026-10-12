import { crearError } from '../utils/errores.js';
import { crearPostulacionService, obtenerPostulacionesService, obtenerPostulacionIdService, actualizarPostulacionService, eliminarPostulacionService } from '../services/postulacion.service.js';

export const obtenerPostulaciones = async (req, res, next) => {
    try {
        const filtrosDTO = req.query;
        const postulaciones = await obtenerPostulacionesService(filtrosDTO);
        res.json(postulaciones);
    } catch (error) {
        console.error(error);
        next(crearError('Error al obtener las postulaciones', 500));
    }
};

export const obtenerPostulacionId = async (req, res, next) => {
    try {
        const id = req.id;
        const postulacion = await obtenerPostulacionIdService(id);
        res.json(postulacion);
    } catch (error) {
        console.error(error);
        if (error.statusCode) return next(error);
        next(crearError('Error al buscar la postulación', 500));
    }
};

export const crearPostulacion = async (req, res, next) => {
    try {
        const postulacionDTO = req.body;
        const nuevaPostulacion = await crearPostulacionService(postulacionDTO);
        res.status(201).json(nuevaPostulacion);
    } catch (error) {
        console.error(error);
        if (error.statusCode) return next(error);
        next(crearError('Error interno al crear la postulación', 500));
    }
};

export const actualizarPostulacion = async (req, res, next) => {
    try {
        const id = req.id; 
        const dataDTO = req.body; // Los datos a actualizar

        const postulacionActualizada = await actualizarPostulacionService(id, dataDTO);
        res.json(postulacionActualizada);
    } catch (error) {
        console.error(error);
        if (error.statusCode) return next(error);
        next(crearError('Error al actualizar la postulación', 500));
    }
};

export const eliminarPostulacion = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await eliminarPostulacionService(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        if (error.statusCode) return next(error);
        next(crearError('Error al eliminar la postulación', 500));
    }
};