import {
    crearPabellonSchema
} from "../validators/pabellones.schemas.js";

export const validarPabellonCreacion = (req, res, next) => {
    const resultado = crearPabellonSchema.safeParse(
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
