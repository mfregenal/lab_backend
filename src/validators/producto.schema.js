import { z } from 'zod';

export const crearProductoSchema = z.object({
    nom_producto: z.string({ required_error: 'El nombre del producto es obligatorio' })
        .min(3, 'El nombre debe tener al menos 3 caracteres'),
    desc_producto: z.string().optional(),
    precio: z.number({ required_error: 'El precio es obligatorio' })
        .positive('El precio debe ser un número positivo'),
    std_producto: z.boolean().optional().default(true),
    artesanoId: z.number({ required_error: 'El ID del artesano es obligatorio' }).int().positive()
});

export const consultarProductosSchema = z.object({
    nombre: z.string().optional(),
    rubro: z.string().optional(),
    stand: z.string().optional(),
    std_producto: z.coerce.boolean().optional(), 
    
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10)
});