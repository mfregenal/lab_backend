import { z } from 'zod';

export const crearArtesanoSchema = z.object({
    usuarioId: z.number({ required_error: 'El ID de usuario es obligatorio' }).int().positive(),
    postulacionId: z.number({ required_error: 'El ID de postulación es obligatorio' }).int().positive(),
    standId: z.number().int().positive().optional() 
});

export const consultarArtesanosSchema = z.object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    rubro: z.string().optional(),
    provincia: z.string().optional(),
    localidad: z.string().optional(),
    stand: z.string().optional(),
    
    pagina: z.coerce.number().int().positive().optional().default(1),
    limite: z.coerce.number().int().positive().optional().default(10)
});