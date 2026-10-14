import { z } from 'zod';
import { obtenerProvinciasService, obtenerLocalidadesPorProvinciaService } from '../services/ubicaciones.service.js';

const provinciasValidas = obtenerProvinciasService();

const datosPostulacionSchema = z.object({
    dni: z.string().min(7).max(10),
    celular: z.string().min(8),
    nom_emprend: z.string().min(3),
    desc_emprend: z.string().min(10),
    trayectoria: z.string().optional(),
    rubroId: z.number().int().positive(),
    
    provincia: z.string({ required_error: "La provincia es obligatoria" })
        .refine((val) => provinciasValidas.includes(val), {
            message: "La provincia ingresada no es válida. Revisa la ortografía."
        }),

    localidad: z.string({ required_error: "La localidad es obligatoria" })
});

const validarLocalidad = (data, contexto) => {
    const localidadesValidas = obtenerLocalidadesPorProvinciaService(data.provincia);

    if (!localidadesValidas.includes(data.localidad.toUpperCase())) {
        contexto.addIssue({
            code: 'custom',
            message: "La localidad no existe dentro de la provincia seleccionada.",
            path: ["localidad"]
        });
    }
};

export const crearPostulacionSchema = datosPostulacionSchema.extend({
    usuarioId: z.number().int().positive()
}).superRefine(validarLocalidad);

export const datosPostulacionUsuarioSchema = datosPostulacionSchema.superRefine(validarLocalidad);


export const consultarPostulacionesSchema = z.object({
    estado: z.enum(['PENDIENTE', 'EN_REVISION', 'REVISION_REQUERIDA', 'APROBADA', 'RECHAZADA']).optional(),
    nombre: z.string().optional(), 
    dni: z.string().optional(),
    provincia: z.string().optional(),

    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10)
});