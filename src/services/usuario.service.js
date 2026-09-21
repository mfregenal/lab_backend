import prisma from '../config/prisma.js'
import { crearError } from '../utils/errores.js'

const SELECT_PUBLIC_USER = {
  id_usuario: true, nombre: true, apellido: true, email: true, rol: true, std_usuario: true, createdAt: true, updatedAt: true
}

export const obtenerTodos = async (query) => {
  const { page, limit, nombre, email, sortBy, sortOrder } = query

  const where = {}
  if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' }
  if (email) where.email = { contains: email, mode: 'insensitive' }

  const [usuarios, total] = await prisma.$transaction([
    prisma.usuario.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { [sortBy]: sortOrder },
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
      page,
      limit,
      totalPages: Math.ceil(total / limit)
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
  // Verificar si el email existe consultando la BD
  const existe = await prisma.usuario.findUnique({ where: { email: datos.email } })
  if (existe) throw crearError('El email ya se encuentra en uso', 409)

  return await prisma.usuario.create({
    data: datos,
    select: SELECT_PUBLIC_USER
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