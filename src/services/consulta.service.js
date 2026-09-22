import prisma from '../config/prisma.js'
import { crearError } from '../utils/errores.js'

// Función auxiliar para convertir dd-mm-yyyy a un objeto Date compatible con Prisma
const parsearFecha = (fechaStr, finDeDia = false) => {
  const [dia, mes, anio] = fechaStr.split('-')
  // Mes en JavaScript va de 0 a 11
  const fecha = new Date(anio, mes - 1, dia)

  if (finDeDia) {
    fecha.setHours(23, 59, 59, 999) // Hasta el final del día
  } else {
    fecha.setHours(0, 0, 0, 0) // Desde el inicio del día
  }
  return fecha
}

export const obtenerTodos = async (query) => {
  const { page, limit, metodo, endpoint, fechaDesde, fechaHasta, sortBy, sortOrder } = query

  const where = {}
  if (metodo) where.metodo = { contains: metodo, mode: 'insensitive' }
  if (endpoint) where.endpoint = { contains: endpoint, mode: 'insensitive' }

  // Lógica de filtrado por fechas
  if (fechaDesde || fechaHasta) {
    where.createAt = {}
    if (fechaDesde) where.createAt.gte = parsearFecha(fechaDesde)
    if (fechaHasta) where.createAt.lte = parsearFecha(fechaHasta, true)

    // Validar que fechaDesde no sea mayor a fechaHasta
    if (fechaDesde && fechaHasta && where.createAt.gte > where.createAt.lte) {
      throw crearError("El rango de fechas es inválido: 'fechaDesde' no puede ser posterior a 'fechaHasta'", 400)
    }
  }

  const [consultas, total] = await prisma.$transaction([
    prisma.consulta.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { [sortBy]: sortOrder },
        { id_consulta: 'desc' } // Desempate por ID requerido
      ]
    }),
    prisma.consulta.count({ where })
  ])

  return {
    data: consultas,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const guardarConsulta = async (datos) => {
  try {
    return await prisma.consulta.create({ data: datos })
  } catch (error) {
    throw new Error(error)
  }
}