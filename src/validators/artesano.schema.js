import { z } from 'zod';

export const crearArtesanoSchema = z.object({
    usuarioID: z.number({ required_error: 'El ID de usuario es obligatorio' }).int().positive(),
    postulacionID: z.number({ required_error: 'El ID de postulación es obligatorio' }).int().positive(),
    rubroID: z.number({ required_error: 'El ID de rubro es obligatorio' }).int().positive()
});

export const consultarArtesanosSchema = z.object({
    rubro: z.string().optional(),
    producto: z.string().optional(),
    stand: z.string().optional()
});