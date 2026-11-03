import { crearError, detallarErroresZod } from '../utils/errores.js';
import { consultarArtesanosSchema, asignarStandSchema } from '../validators/artesano.schema.js';

export const validarConsultaArtesanos = (req, res, next) => {
    const resultado = consultarArtesanosSchema.safeParse(req.query);

    if (!resultado.success) {
        return next(crearError("Los parámetros de búsqueda son inválidos.", 400, detallarErroresZod(resultado.error)));
    }

    req.queryValido = resultado.data;
    return next();
};

export const validarAsignacionStand = (req, res, next) => {
    const resultado = asignarStandSchema.safeParse(req.body);
    if (!resultado.success) return next(crearError('Debe indicar un stand válido.', 400, detallarErroresZod(resultado.error)));
    req.body = resultado.data;
    return next();
};
