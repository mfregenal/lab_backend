import { crearError } from '../utils/errores.js';

export const validarId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return next(crearError('ID Invalido', 400));
    }

    req.id = id;
    next();
};