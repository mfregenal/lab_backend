import { z } from 'zod'

// Expresión regular para validar formato dd-mm-yyyy
const regexFecha = /^\d{2}-\d{2}-\d{4}$/

export const crearConsultaSchema = z.object({
  metodo: z.string().min(1, "El método es requerido"),
  endpoint: z.string().min(1, "El endpoint es requerido"),
  query: z.record(z.any()).nullable().optional(),
  params: z.record(z.any()).nullable().optional()
})

export const ConsultarConsultasSchema = z.object({
  pagina: z.coerce.number().int().min(1, "La página debe ser mayor a 0").optional().default(1),
  limite: z.coerce.number().int().min(1).max(100, "Máximo 100 por página").optional().default(10),
  metodo: z.string().optional(),
  endpoint: z.string().optional(),
  fechaDesde: z.string().regex(regexFecha, "fechaDesde debe tener formato dd-mm-yyyy")
              .transform( (valor) => {
                const [dia, mes, anio] = valor.split('-')
                return new Date(anio, mes - 1, dia, 0, 0, 0, 0)
              }).optional(),
  fechaHasta: z.string().regex(regexFecha, "fechaHasta debe tener formato dd-mm-yyyy")
              .transform( (valor) => {
                const [dia, mes, anio] = valor.split('-')
                return new Date(anio, mes - 1, dia, 23, 59, 59, 999)
              }).optional(),
  ordenPor: z.enum(['createAt', 'metodo', 'endpoint', 'id_consulta']).optional().default('id_consulta'),
  direccion: z.enum(['asc', 'desc']).optional().default('desc')
})

.refine((data) => {
  if (data.fechaDesde && data.fechaHasta) {
    return data.fechaDesde <= data.fechaHasta
  }
  return true // Si falta alguna de las dos fechas, pasa la validación
}, {
  message: "El rango de fechas es inválido: 'fechaDesde' no puede ser posterior a 'fechaHasta'",
  path: ["fechaHasta"] // En qué campo queremos que Zod marque el error
})