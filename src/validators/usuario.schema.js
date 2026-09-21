import { z } from 'zod'

// Esquema para la creación (POST)
export const crearUsuarioSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 letras").max(50),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 letras").max(50),
  email: z.string().email("Formato de email inválido").toLowerCase(),
  contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rol: z.enum(['visitante', 'artesano', 'administrador']).optional().default('visitante')
})

// Esquema para actualización (PUT) - partial() hace que los campos sean opcionales
export const actualizarUsuarioSchema = crearUsuarioSchema.partial()

// Esquema para validar los query params del GET /usuarios
export const ConsultarUsuariosSchema = z.object({
  page: z.coerce.number().int().min(1, "La página debe ser mayor a 0").optional().default(1),
  limit: z.coerce.number().int().min(1).max(100, "Máximo 100 por página").optional().default(10),
  nombre: z.string().optional(),
  email: z.string().optional(),
  sortBy: z.enum(['createdAt', 'nombre', 'apellido']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})