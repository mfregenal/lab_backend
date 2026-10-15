import prisma from '../config/prisma.js'
import { crearError } from '../utils/errores.js'
import bcrypt from 'bcrypt'

const SELECT_PUBLIC_USER = {
  id_usuario: true, nombre: true, apellido: true, email: true, rol: true, std_usuario: true, createdAt: true, updatedAt: true
}

const FACTOR_COSTO=10

export const obtenerTodos = async (query) => {
  const { pagina, limite, nombre, email, rol, ordenPor, direccion } = query

  const where = {}
  if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' }
  if (email) where.email = { contains: email, mode: 'insensitive' }
  if (rol) where.rol = rol

  const [usuarios, total] = await prisma.$transaction([
    prisma.usuario.findMany({
      where,
      skip: (pagina - 1) * limite,
      take: limite,
      orderBy: [
        { [ordenPor]: direccion },
        { id_usuario: 'desc' } // Desempate por ID
      ],
      select: SELECT_PUBLIC_USER
    }),
    prisma.usuario.count({ where })
  ])


  return {
    data: usuarios,
    meta: {
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite)
    }
  }
}

export const obtenerPorId = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
    select: SELECT_PUBLIC_USER
  })

  if (!usuario) throw crearError('Usuario no encontrado', 404)

  return usuario
}

export const crear = async (datos) => {
  const { postulacion, ...datosUsuario } = datos
  const rol = datosUsuario.rol ?? 'ARTESANO'

  return prisma.$transaction(async (tx) => {
    if (postulacion) {
      const rubroExiste = await tx.rubro.findUnique({
        where: { id_rubro: postulacion.rubroId },
        select: { id_rubro: true }
      })

      if (!rubroExiste) {
        throw crearError(`El rubro con ID ${postulacion.rubroId} no existe`, 404)
      }
    }
    
    const contrasenaHash = await bcrypt.hash(datosUsuario.contrasena, FACTOR_COSTO)
    datosUsuario.contrasena = contrasenaHash
    
    const usuario = await tx.usuario.create({
      data: { ...datosUsuario, rol },
      select: SELECT_PUBLIC_USER
    })

    if (!postulacion) return { ...usuario, postulacion: null }

    const postulacionCreada = await tx.postulacion.create({
      data: {
        ...postulacion,
        usuarioId: usuario.id_usuario
      }
    })

    return { ...usuario, postulacion: postulacionCreada }
  })
}

export const actualizar = async (id, datos) => {
  const usuarioActual = await prisma.usuario.findUnique({ where: { id_usuario: id } })
  if (!usuarioActual) throw crearError('Usuario no encontrado', 404)

  // Si cambia el email, validar que no esté en uso
  if (datos.email && datos.email !== usuarioActual.email) {
    const existe = await prisma.usuario.findUnique({ where: { email: datos.email } })
    if (existe) throw crearError('El email ya se encuentra en uso', 409)
  }

  return await prisma.usuario.update({
    where: { id_usuario: id },
    data: datos,
    select: SELECT_PUBLIC_USER
  })
}

export const eliminar = async (id) => {
  try {
    await prisma.usuario.delete({ where: { id_usuario: id } })
  } catch (error) {
    if (error.code === 'P2025') throw crearError('Usuario no encontrado', 404)
    throw error
  }
}

export const iniciarSesion = async (datos) => {
  const usuario = await prisma.usuario.findUnique({where: { email: datos.email}})

  if (!usuario) throw crearError('Email o contraseña incorrectos', 401)

  const contrasenaValida = await bcrypt.compare( datos.contrasena, usuario.contrasena )

  if (!contrasenaValida) {
    throw crearError('Email o contraseña incorrectos', 401)
  }

  delete usuario.contrasena // Eliminamos la contraseña antes de devolver el usuario

  return usuario
}