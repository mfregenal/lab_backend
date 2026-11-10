export const errorMiddleware = (err, req, res, next) => {
  if (err.code === 'P2002') {
    return res.status(409).json({
      mensaje: `Ya existe un registro con ese valor único en el campo (${err.meta?.target || 'código'})`
    });
  }

  // Clave foránea: el registro está relacionado con otros o la referencia no existe.
  if (err.code === 'P2003') {
    return res.status(409).json({
      mensaje: 'No se puede completar la operación porque el registro está relacionado con otros datos.'
    })
  }

  const status = err.statusCode || err.status || 500

  if (status >= 500) {
    console.error(err)
    return res.status(status).json({ mensaje: "Error interno del servidor" })
  }

  res.status(status).json({ mensaje: err.message || "Ocurrio un error inesperado", detalles: err.detalles || {} })
}