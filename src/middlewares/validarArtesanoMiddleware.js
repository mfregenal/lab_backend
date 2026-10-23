import { crearArtesanoSchema, consultarArtesanosSchema, asignarStandSchema } from '../validators/artesano.schema.js';

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

    req.queryValido = resultado.data;
    return next();
};

export const validarAsignacionStand = (req, res, next) => {
    const resultado = asignarStandSchema.safeParse(req.body);
    if (!resultado.success) return res.status(400).json({ mensaje: 'Debe indicar un stand válido.', errores: resultado.error.issues });
    req.body = resultado.data;
    return next();
};