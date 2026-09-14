export const crearError = ( mensaje, status ) => {
  const error = new Error( mensaje )
  error.status = status
  error.statusCode = status

  return error
}