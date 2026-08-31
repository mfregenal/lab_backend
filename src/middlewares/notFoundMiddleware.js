import { crearError } from '../utils/errores.js'

export const notFoundMiddleware = ( req, res, next ) => {
  next( crearError( `Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404 ) )
}