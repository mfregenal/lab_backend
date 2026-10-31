import { crearError, detallarErroresZod } from "../utils/errores.js";
import {
    crearPabellonSchema
} from "../validators/pabellon.schema.js";

export const validarPabellonCreacion = (req, res, next) => {
    const resultado = crearPabellonSchema.safeParse(
        req.body
    );
    if (!resultado.success) {
        return next(crearError("Los datos enviados son inválidos.", 400, detallarErroresZod(resultado.error)));
    }
    req.body = resultado.data;
    return next();
};