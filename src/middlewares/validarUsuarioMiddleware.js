import { crearError } from '../utils/errores.js'

export const validarUsuario = ( req, res, next ) => {
  const { nombre, apellido, email, contrasena } = req.body

  if( typeof  nombre !== 'string' || nombre.trim() === '' || !isNaN( nombre ) ) {
    return next( crearError( 'Nombre no valido', 400 ) )
  }

  if( typeof apellido !== 'string' || apellido.trim() === '' || !isNaN( apellido ) ) {
    return next( crearError( 'Apellido no valido', 400 ) )
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if( typeof email !== 'string' || !emailRegex.test( email.trim() ) ) {
    return next( crearError( 'Email no valido', 400 ) )
  }

  if( typeof contrasena !== 'string' || contrasena.trim() === '' || contrasena.length < 8 ) {
    return next( crearError( 'Contraseña no valida', 400 ) )
  }

  req.body.nombre = nombre.trim().replace(/\s+/g, ' ')
  req.body.apellido = apellido.trim().replace(/\s+/g, ' ')
  req.body.email = email.trim().toLocaleLowerCase()
  req.body.contrasena = contrasena.trim()

  next()
} 