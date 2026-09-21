import prisma from '../config/prisma.js'
import { crearError } from '../utils/errores.js'

export const obtenerTodos = async (query) => {
  const { page, limit, nom_rubro, desc_rubro, sortBy, sortOrder } = query

  const where = {}
  if (nom_rubro) where.nom_rubro = { contains: nom_rubro, mode: 'insensitive' }
  if (desc_rubro) where.desc_rubro = { contains: desc_rubro, mode: 'insensitive' }

  const [rubros, total] = await prisma.$transaction([
    prisma.rubro.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { [sortBy]: sortOrder },
        { id_rubro: 'desc' } // Desempate por id
      ]
    }),
    prisma.rubro.count({ where })
  ])

  return {
    data: rubros,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const obtenerPorId = async (id) => {
  const rubro = await prisma.rubro.findUnique({ where: { id_rubro: id } })
  if (!rubro) throw crearError('Rubro no encontrado', 404)
  return rubro
}

export const crear = async (datos) => {
  // No permitir rubros duplicados
  const existe = await prisma.rubro.findFirst({ 
    where: { nom_rubro: { equals: datos.nom_rubro, mode: 'insensitive' } } 
  })
  if (existe) throw crearError('El nombre del rubro ya existe', 409)

  return await prisma.rubro.create({ data: datos })
}

export const actualizar = async (id, datos) => {
  const rubroActual = await prisma.rubro.findUnique({ where: { id_rubro: id } })
  if (!rubroActual) throw crearError('Rubro no encontrado', 404)

  if (datos.nom_rubro && datos.nom_rubro.toLowerCase() !== rubroActual.nom_rubro.toLowerCase()) {
    const existe = await prisma.rubro.findFirst({ 
      where: { nom_rubro: { equals: datos.nom_rubro, mode: 'insensitive' } } 
    })
    if (existe) throw crearError('El nombre del rubro ya existe', 409)
  }

  return await prisma.rubro.update({
    where: { id_rubro: id },
    data: datos
  })
}

export const eliminar = async (id) => {
  try {
    await prisma.rubro.delete({ where: { id_rubro: id } })
  } catch (error) {
    if (error.code === 'P2025') throw crearError('Rubro no encontrado', 404)
    throw error 
  }
}