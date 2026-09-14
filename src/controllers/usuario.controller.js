import { crearError } from '../utils/errores.js'
import prisma from '../config/prisma.js'

export const obtenerUsuarios = async (req, res, next) => {
  try {
    const { nombre, apellido, email } = req.query // Filtros de búsqueda opcionales

    const where = {} // Objeto para construir la consulta de búsqueda
    if ( nombre ) { where.nombre = { contains: nombre, mode: 'insensitive' } } // Filtro por nombre
    if ( apellido ) { where.apellido = { contains: apellido, mode: 'insensitive' } } // Filtro por apellido
    if ( email ) { where.email = { contains: email, mode: 'insensitive' } } // Filtro por email

    const usuarios = await prisma.usuario.findMany( { where } ) // Obtener todos los usuarios que coincidan con los filtros de búsqueda

    res.json( usuarios ) // Devolver la lista de usuarios como respuesta
  } catch ( error ) {
    next( error)
  }
}

export const obtenerUsuarioPorId = async ( req, res, next ) => {
  try {
    const usuario = await prisma.usuario.findUnique( { where: { id_usuario: parseInt( req.params.id ) } } )

    if ( !usuario ) { return next( crearError( 'Usuario no encontrado', 404 ) ) }

    delete usuario.contrasena
    res.json( usuario )
  } catch ( error ) {
    next( error )
  }
}

// Necesidad de hash de contraseña para seguridad, se puede usar bcrypt para esto.
export const crearUsuario = async ( req, res, next ) => {
  try {
    const { nombre, apellido, email, contrasena, rol } = req.body

    const emailExiste = await prisma.usuario.findUnique( { where: { email: email } } )

    if( emailExiste ) {
      return next( crearError( 'El email ya se encuentra en uso', 404 ) )
    }

    const nuevoUsuario = await prisma.usuario.create( { data: { nombre, apellido, email, contrasena, rol } } )

    delete nuevoUsuario.contrasena
    res.status( 201 ).json( nuevoUsuario )
  } catch ( error ) {
    next( error )
  }
}

// Necesidad de hash de contraseña para seguridad, se puede usar bcrypt para esto.
export const actualizarUsuario = async ( req, res, next ) => {
  try {
    const where = { id_usuario: parseInt( req.params.id ) }
    const usuarioExiste = await prisma.usuario.findUnique( { where } )

    if ( !usuarioExiste ) { return next( crearError( 'Usuario no encontrado', 404 ) ) }

    const { nombre, apellido, email, contrasena, rol } = req.body

    const usuarioActualizado = await prisma.usuario.update( {
      where,
      data: { nombre, apellido, email, contrasena, rol }
    } )

    delete usuarioActualizado.contrasena
    res.json( usuarioActualizado )
  } catch ( error ) {
    next( error )
  }
}

export const eliminarUsuario = async ( req, res, next ) => {
  try {
    const where = { id_usuario: parseInt( req.params.id ) }
    const usuarioExiste = await prisma.usuario.findUnique( { where } )

    if ( !usuarioExiste ) { return next( crearError( 'Usuario no encontrado', 404 ) ) }

    await prisma.usuario.delete( { where } )

    res.json( { message: 'Usuario eliminado correctamente' } )
  } catch ( error ) {
    next( error )
  }
}
