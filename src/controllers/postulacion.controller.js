import { crearError } from '../utils/errores.js';
import { obtenerPostulacionesService, obtenerPostulacionIdService, actualizarPostulacionService, eliminarPostulacionService } from '../services/postulacion.service.js';


export const obtenerPostulaciones = async (req, res, next) => {
    try {
        const filtrosDTO = req.queryValido;
        const postulaciones = await obtenerPostulacionesService(filtrosDTO, req.usuario);
        res.json(postulaciones);
    } catch (error) {
        console.error(error);
        if (error.status || error.statusCode) return next(error);
        next(crearError('Error al obtener las postulaciones', 500));
    }
};


export const obtenerPostulacionId = async (req, res, next) => {
    try {
        const id = req.id;
        const postulacion = await obtenerPostulacionIdService(id, req.usuario);
        res.json(postulacion);
    } catch (error) {
        console.error(error);
        if (error.status || error.statusCode) return next(error);
        next(crearError('Error al buscar la postulación', 500));
    }
};


export const actualizarPostulacion = async (req, res, next) => {
    try {
        const id = req.id;
        const dataDTO = req.body; // Los datos a actualizar


        const postulacionActualizada = await actualizarPostulacionService(id, dataDTO, req.usuario);
        res.json(postulacionActualizada);
    } catch (error) {
        console.error(error);
        if (error.status || error.statusCode) return next(error);
        next(crearError('Error al actualizar la postulación', 500));
    }
};


export const eliminarPostulacion = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await eliminarPostulacionService(id, req.usuario);
        res.status(200).json({ mensaje: "Postulación borrada correctamente" });
    } catch (error) {
        console.error(error);
        if (error.status || error.statusCode) return next(error);
        next(crearError('Error al eliminar la postulación', 500));
    }
};