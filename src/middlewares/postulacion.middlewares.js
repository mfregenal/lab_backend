import {crearPostulacionSchema, consultarPostulacionesSchema} from "../validators/postulacion.schema.js";

export const validarCreacionPostulacion = (req, res, next) => {
    const resultado = crearPostulacionSchema.safeParse(
        req.body
    );

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los datos enviados son inválidos.",
            errores: resultado.error.issues
        });
    }

    req.body = resultado.data;

    return next();
};

export const validarConsultaPostulaciones = (req, res, next) => {
    if (req.query.estado) {
        req.query.estado = req.query.estado.toUpperCase();
    }

    const resultado = consultarPostulacionesSchema.safeParse(req.query);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los parámetros de búsqueda son inválidos.",
            errores: resultado.error.issues
        });
    }

    // req.body = resultado.data;

    return next();
};