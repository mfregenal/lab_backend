import { crearStandSchema, consultarStandsSchemas, actualizarStandSchema } from "../validators/stand.schema.js";

export const validarCreacionStand = (req, res, next) => {
    const resultado = crearStandSchema.safeParse(
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

export const validarConsultaStands = (req, res, next) => {
    const resultado = consultarStandsSchemas.safeParse(req.query);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje:
                "Los parámetros de consulta son inválidos.",
            errores: resultado.error.issues
        });
    }

    req.consultaStands = resultado.data;

    return next();
};

export const validarActualizacionStand = (req, res, next) => {
    const resultado = actualizarStandSchema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los datos para actualizar el stand son inválidos.",
            errores: resultado.error.issues,
        });
    }

    req.body = resultado.data;
    return next();
};