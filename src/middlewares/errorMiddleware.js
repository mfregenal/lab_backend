export const errorMiddleware = (err, req, res, next) => {
  if (err.code === 'P2002') {
    return res.status(409).json({
      mensaje: `Ya existe un registro con ese valor único en el campo (${err.meta?.target || 'código'})`
    });
  }

  const status = err.statusCode || err.status || 500

  if (status >= 500) {
    console.error(err)
    return res.status(status).json({ mensaje: "Error interno del servidor" })
  }

  res.status(status).json({ mensaje: err.message || "Ocurrio un error inesperado", detalles: err.detalles || {} })
}