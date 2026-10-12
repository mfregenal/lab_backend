import prisma from '../config/prisma.js'

export const obtenerTodos = async (query) => {
  const { pagina, limite, metodo, endpoint, fechaDesde, fechaHasta, ordenPor, direccion } = query

  const where = {}
  if (metodo) where.metodo = { contains: metodo, mode: 'insensitive' }
  if (endpoint) where.endpoint = { contains: endpoint, mode: 'insensitive' }

  // Lógica de filtrado por fechas
  if (fechaDesde || fechaHasta) {
    where.createAt = {}
    if (fechaDesde) where.createAt.gte = fechaDesde
    if (fechaHasta) where.createAt.lte = fechaHasta
  }

  const [consultas, total] = await prisma.$transaction([
    prisma.consulta.findMany({
      where,
      skip: (pagina - 1) * limite,
      take: limite,
      orderBy: [
        { [ordenPor]: direccion },
        { id_consulta: 'desc' } // Desempate por ID requerido
      ]
    }),
    prisma.consulta.count({ where })
  ])

  return {
    data: consultas,
    meta: {
      total,
      pagina,
      limite,
      totalPages: Math.ceil(total / limite)
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