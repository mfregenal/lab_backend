import { z } from 'zod'

export const crearRubroSchema = z.object({
  nom_rubro: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  desc_rubro: z.string().max(255).optional().nullable()
})

export const actualizarRubroSchema = crearRubroSchema.partial()

export const ConsultarRubrosSchema = z.object({
  pagina: z.coerce.number().int().min(1, "La página debe ser mayor a 0").optional().default(1),
  limite: z.coerce.number().int().min(1).max(100, "Máximo 100 por página").optional().default(10),
  nom_rubro: z.string().optional(),
  desc_rubro: z.string().optional(),
  ordenPor: z.enum(['createdAt', 'nom_rubro', 'id_rubro']).optional().default('id_rubro'),
  direccion: z.enum(['asc', 'desc']).optional().default('desc')
})