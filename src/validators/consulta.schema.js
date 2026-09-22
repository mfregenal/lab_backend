import { z } from 'zod'

// Expresión regular para validar formato dd-mm-yyyy
const regexFecha = /^\d{2}-\d{2}-\d{4}$/

export const crearConsultaSchema = z.object({
  metodo: z.string().min(1, "El método es requerido"),
  endpoint: z.string().min(1, "El endpoint es requerido"),
  query: z.string().optional(),
  params: z.string().optional()
})

export const ConsultarConsultasSchema = z.object({
  page: z.coerce.number().int().min(1, "La página debe ser mayor a 0").optional().default(1),
  limit: z.coerce.number().int().min(1).max(100, "Máximo 100 por página").optional().default(10),
  metodo: z.string().optional(),
  endpoint: z.string().optional(),
  fechaDesde: z.string().regex(regexFecha, "fechaDesde debe tener formato dd-mm-yyyy").optional(),
  fechaHasta: z.string().regex(regexFecha, "fechaHasta debe tener formato dd-mm-yyyy").optional(),
  sortBy: z.enum(['createAt', 'metodo', 'endpoint', 'id_consulta']).optional().default('id_consulta'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})