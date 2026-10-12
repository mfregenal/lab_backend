import { crearProductoSchema, consultarProductosSchema } from '../validators/producto.schema.js';

export const validarCreacionProducto = (req, res, next) => {
    const resultado = crearProductoSchema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los datos enviados para el producto son inválidos.",
            errores: resultado.error.issues
        });
    }

    req.body = resultado.data;
    return next();
};

export const validarConsultaProductos = (req, res, next) => {
    const resultado = consultarProductosSchema.safeParse(req.query);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los parámetros de búsqueda son inválidos.",
            errores: resultado.error.issues
        });
    }

    Object.assign(req.query, resultado.data);
    return next();
};