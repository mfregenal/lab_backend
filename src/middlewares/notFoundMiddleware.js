export const notFoundMiddleware = ( req, res, next) => {
  const error = new Error( `Ruta no encontrada - ${req.originalUrl}`, 404 )

  next(error)
}