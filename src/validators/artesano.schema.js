import { z } from 'zod';

export const consultarArtesanosSchema = z.object({
    nombre: z.string({ error: 'El nombre debe ser texto' }).optional(),
    apellido: z.string({ error: 'El apellido debe ser texto' }).optional(),
    rubro: z.string({ error: 'El rubro debe ser texto' }).optional(),
    provincia: z.string({ error: 'La provincia debe ser texto' }).optional(),
    localidad: z.string({ error: 'La localidad debe ser texto' }).optional(),
    stand: z.string({ error: 'El stand debe ser texto' }).optional(),

    pagina: z.coerce.number({ error: 'La página debe ser un número' })
        .int('La página debe ser un número entero')
        .min(1, 'La página debe ser mayor a 0').optional().default(1),
        
    limite: z.coerce.number({ error: 'El límite debe ser un número' })
        .int('El límite debe ser un número entero')
        .min(1, 'El límite debe ser al menos 1')
        .max(100, 'Máximo 100 resultados por página').optional().default(10)
});

export const asignarStandSchema = z.object({
    standId: z.coerce.number().int().positive()
}).strict();