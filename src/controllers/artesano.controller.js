import {artesanos, siguienteId} from '../data/artesano.js';

export const obtenerArtesanos = (req, res) => {
    res.json(artesanos);
};

export const obtenerArtesanoId = (req, res) => {
    const id = parseInt(req.params.id);
    const artesano = artesanos.find(a => a.id === id);

    if (!artesano) {
        return res.status(404).json({ error: 'Artesano no encontrado' });
    }

    res.json(artesano);
};

export const crearArtesano = (req, res) => {
    const { nombre, provincia, localidad, rubro } = req.body;

    if (!nombre || !rubro) {
        return res.status(400).json({ error: 'El nombre y el rubro son obligatorios' });
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