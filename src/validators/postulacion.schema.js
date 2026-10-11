import { z } from 'zod';

// 1. Exportación para CREAR (POST)
export const crearPostulacionSchema = z.object({
    dni: z.string().min(7).max(10),
    celular: z.string().min(8),
    pais: z.string().optional(),
    provincia: z.string().optional(),
    localidad: z.string(),
    nom_emprend: z.string().min(3),
    desc_emprend: z.string().min(10),
    trayectoria: z.string().optional(),
    usuarioId: z.number().int().positive(), 
    rubroId: z.number().int().positive()
});

// 2. Exportación para CONSULTAR y FILTRAR (GET) - ¡Esta es la que no encontraba!
export const consultarPostulacionesSchema = z.object({
    estado: z.enum(['PENDIENTE', 'EN_REVISION', 'REVISION_REQUERIDA', 'APROBADA', 'RECHAZADA']).optional(),
    nombre: z.string().optional(), 
    dni: z.string().optional(),
    pais: z.string().optional(),
    
    // Paginación
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10)
});