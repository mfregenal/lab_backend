import { z } from 'zod';

export const crearProductoSchema = z.object({
  nom_producto: z.string({
    error: (i) => i.input === undefined
      ? 'El nombre del producto es obligatorio'
      : 'El nombre del producto debe ser texto'
  }).min(3, 'El nombre debe tener al menos 3 caracteres'),

  desc_producto: z.string({
    error: 'La descripción debe ser texto'
  }).optional(),

  precio: z.number({
    error: (i) => i.input === undefined
      ? 'El precio es obligatorio'
      : 'El precio debe ser un número'
  }).positive('El precio debe ser un número positivo'),

  std_producto: z.boolean({
    error: 'El estado del producto debe ser verdadero o falso'
  }).optional().default(true),

  artesanoId: z.number({
    error: 'El ID del artesano debe ser un número'
  }).int('El ID del artesano debe ser un número entero').positive('El ID del artesano debe ser positivo').optional()
  // Cambie para que sea opcional, ya que puede ser proporcionado por el contexto de la solicitud.
});

export const actualizarProductoSchema = crearProductoSchema.omit({ artesanoId: true }).partial();

export const consultarProductosSchema = z.object({
  nombre: z.string({ error: 'El nombre para filtrar debe ser texto' }).optional(),
  rubro: z.string({ error: 'El rubro para filtrar debe ser texto' }).optional(),
  stand: z.string({ error: 'El stand para filtrar debe ser texto' }).optional(),
  std_producto: z.enum(['true', 'false'])
    .transform((valor) => valor === 'true')
    .optional(),
  artesanoId: z.coerce.number().int().positive().optional(),
  ordenPor: z.enum(['nom_producto', 'precio', 'id_producto']).optional().default('id_producto'),
  direccion: z.enum(['asc', 'desc']).optional().default('asc'),

  pagina: z.coerce.number({ error: 'La página debe ser un número' })
    .int('La página debe ser un número entero')
    .min(1, 'La página debe ser mayor a 0').optional().default(1),

  limite: z.coerce.number({ error: 'El límite debe ser un número' })
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser al menos 1')
    .max(100, 'Máximo 100 resultados por página').optional().default(10)
});