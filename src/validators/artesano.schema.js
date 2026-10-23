import { z } from 'zod';

export const crearArtesanoSchema = z.object({
    usuarioId: z.number({ 
        required_error: 'El ID de usuario es obligatorio',
        invalid_type_error: 'El ID de usuario debe ser un número'
    }).int('El ID de usuario debe ser un número entero').positive('El ID de usuario debe ser positivo'),
    
    postulacionId: z.number({ 
        required_error: 'El ID de postulación es obligatorio',
        invalid_type_error: 'El ID de postulación debe ser un número'
    }).int('El ID de postulación debe ser un número entero').positive('El ID de postulación debe ser positivo'),
    
    standId: z.number({ 
        invalid_type_error: 'El ID del stand debe ser un número' 
    }).int('El ID del stand debe ser un número entero').positive('El ID del stand debe ser positivo').optional() 
});

export const consultarArtesanosSchema = z.object({
    nombre: z.string({ invalid_type_error: 'El nombre debe ser texto' }).optional(),
    apellido: z.string({ invalid_type_error: 'El apellido debe ser texto' }).optional(),
    rubro: z.string({ invalid_type_error: 'El rubro debe ser texto' }).optional(),
    provincia: z.string({ invalid_type_error: 'La provincia debe ser texto' }).optional(),
    localidad: z.string({ invalid_type_error: 'La localidad debe ser texto' }).optional(),
    stand: z.string({ invalid_type_error: 'El stand debe ser texto' }).optional(),
    
    pagina: z.coerce.number({ invalid_type_error: 'La página debe ser un número' })
        .int('La página debe ser un número entero')
        .min(1, 'La página debe ser mayor a 0').optional().default(1),
        
    limite: z.coerce.number({ invalid_type_error: 'El límite debe ser un número' })
        .int('El límite debe ser un número entero')
        .min(1, 'El límite debe ser al menos 1')
        .max(100, 'Máximo 100 resultados por página').optional().default(10)
});

export const asignarStandSchema = z.object({
    standId: z.coerce.number().int().positive()
}).strict();