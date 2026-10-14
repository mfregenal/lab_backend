import { crearArtesanoSchema, consultarArtesanosSchema } from '../validators/artesano.schema.js';

export const validarCreacionArtesano = (req, res, next) => {
    const resultado = crearArtesanoSchema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los datos enviados para el artesano son inválidos.",
            errores: resultado.error.issues
        });
    }

    req.body = resultado.data;
    return next();
};

export const validarConsultaArtesanos = (req, res, next) => {
    const resultado = consultarArtesanosSchema.safeParse(req.query);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los parámetros de búsqueda son inválidos.",
            errores: resultado.error.issues
        });
    }

    Object.assign(req.query, resultado.data);
    return next();
};