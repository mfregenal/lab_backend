import {artesanos, siguienteId} from '../data/artesano.js';
import { crearError } from '../utils/errores.js'

export const obtenerArtesanos = (req, res) => {
    res.json(artesanos);
};

export const obtenerArtesanoId = (req, res, next) => {
    const id = parseInt(req.params.id);
    const artesano = artesanos.find(a => a.id === id);

    if (!artesano) {
        return next(crearError(`no existe un artesano con id ${req.params.id}`, 404));
    }

    res.json(artesano);
};

export const crearArtesano = (req, res, next) => {
    const { nombre, provincia, localidad, rubro } = req.body;

    if (!nombre || !rubro || !provincia || !localidad) {
        return next(crearError('Faltan datos obligatorios', 400));
    }

    const nuevoArtesano = {
        id: siguienteId(),
        nombre,
        provincia,
        localidad,
        rubro
    };

    artesanos.push(nuevoArtesano);
    res.status(201).json(nuevoArtesano);
};

export const eliminarArtesano = (req, res, next) => {
    const id = parseInt(req.params.id);

    const indice = artesanos.findIndex(artesano => artesano.id === id);
    

    if (indice === -1) {
        return next(crearError(`no existe un artesano con id ${req.params.id}`, 404));
    }

    artesanos.splice(indice, 1);
    res.status(204).send();
};