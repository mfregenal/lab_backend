import { z } from 'zod';


export const crearPostulacionSchema = z.object({

    dni: z.string().min(7).max(10),
    celular: z.string().min(8),
    pais: z.string().optional(),
    provincia: z.string().optional(),
    localidad: z.string(),
    nom_emprend: z.string().min(3),
    desc_emprend: z.string().min(10),
    trayectoria: z.string().optional(),
    visitanteId: z.number().int().positive(),
    rubroId: z.number().int().positive()
});

export const consultarPostulacionesSchema = z.object({
    estado: z.enum(['APROBADA', 'RECHAZADA', 'MODIFICACION', 'PENDIENTE']).optional(),
    nombre: z.string().optional(), 
    dni: z.string().optional(),
    pais: z.string().optional()
});