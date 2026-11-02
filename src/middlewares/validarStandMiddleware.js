import { crearError, detallarErroresZod } from "../utils/errores.js";
import { crearStandSchema, consultarStandsSchemas, actualizarStandSchema } from "../validators/stand.schema.js";

export const validarCreacionStand = (req, res, next) => {
    const resultado = crearStandSchema.safeParse(
        req.body
    );

    if (!resultado.success) {
        return next(crearError("Los datos enviados son inválidos.", 400, detallarErroresZod(resultado.error)));
    }

    req.body = resultado.data;

    return next();
};

export const validarConsultaStands = (req, res, next) => {
    const resultado = consultarStandsSchemas.safeParse(req.query);

    if (!resultado.success) {
        return next(crearError("Los parámetros de consulta son inválidos.", 400, detallarErroresZod(resultado.error)));
    }

    req.consultaStands = resultado.data;

    return next();
};

export const validarActualizacionStand = (req, res, next) => {
    const resultado = actualizarStandSchema.safeParse(req.body);

    if (!resultado.success) {
        return next(crearError("Los datos para actualizar el stand son inválidos.", 400, detallarErroresZod(resultado.error)));
    }

    req.body = resultado.data;
    return next();
};