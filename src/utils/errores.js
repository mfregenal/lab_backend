export const crearError = (mensaje, status, detalles) => {
  const error = new Error(mensaje)
  error.status = status
  if (detalles) {
    error.detalles = detalles
  }

  return error
}

export const detallarErroresZod = (errorZod) =>
  errorZod.issues.map((issues) => ({
    campo: issues.patch.join('.') || null,
    mensaje: issues.message
  }))