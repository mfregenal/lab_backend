import { z } from 'zod';
import { obtenerProvinciasService, obtenerLocalidadesPorProvinciaService } from '../services/ubicaciones.service.js';

const provinciasValidas = obtenerProvinciasService();

export const crearPostulacionSchema = z.object({
    dni: z.string().min(7).max(10),
    celular: z.string().min(8),
    nom_emprend: z.string().min(3),
    desc_emprend: z.string().min(10),
    trayectoria: z.string().optional(),
    usuarioId: z.number().int().positive(),
    rubroId: z.number().int().positive(),
    
    provincia: z.string({ required_error: "La provincia es obligatoria" })
        .refine((val) => provinciasValidas.includes(val), {
            message: "La provincia ingresada no es válida. Revisa la ortografía."
        }),
        
    localidad: z.string({ required_error: "La localidad es obligatoria" })
}).refine((data) => {
    const localidadesValidas = obtenerLocalidadesPorProvinciaService(data.provincia);
    
    return localidadesValidas.includes(data.localidad.toUpperCase()); 
}, {
    message: "La localidad no existe dentro de la provincia seleccionada.",
    path: ["localidad"] 
});


export const consultarPostulacionesSchema = z.object({
    estado: z.enum(['PENDIENTE', 'EN_REVISION', 'REVISION_REQUERIDA', 'APROBADA', 'RECHAZADA']).optional(),
    nombre: z.string().optional(), 
    dni: z.string().optional(),
    provincia: z.string().optional(),
    
    pagina: z.coerce.number().int().positive().optional().default(1),
    limite: z.coerce.number().int().positive().optional().default(10)
});