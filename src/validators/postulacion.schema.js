import { z } from 'zod';
import { obtenerProvinciasService, obtenerLocalidadesPorProvinciaService } from '../services/ubicaciones.service.js';

const provinciasValidas = obtenerProvinciasService();

const datosPostulacionSchema = z.object({
    dni: z.string({ 
        required_error: "El DNI es obligatorio",
        invalid_type_error: "El DNI debe ser texto" 
    })
    .min(7, "El DNI debe tener al menos 7 caracteres")
    .max(10, "El DNI no puede superar los 10 caracteres"),

    celular: z.string({ 
        required_error: "El celular es obligatorio",
        invalid_type_error: "El celular debe ser texto" 
    })
    .min(8, "El celular debe tener al menos 8 caracteres"),

    nom_emprend: z.string({ 
        required_error: "El nombre del emprendimiento es obligatorio",
        invalid_type_error: "El nombre debe ser texto" 
    })
    .min(3, "El nombre del emprendimiento debe tener al menos 3 caracteres"),

    desc_emprend: z.string({ 
        required_error: "La descripción del emprendimiento es obligatoria",
        invalid_type_error: "La descripción debe ser texto" 
    })
    .min(10, "La descripción debe tener al menos 10 caracteres"),

    trayectoria: z.string({ 
        invalid_type_error: "La trayectoria debe ser texto" 
    }).optional(),

    rubroId: z.number({ 
        required_error: "El ID del rubro es obligatorio", 
        invalid_type_error: "El ID del rubro debe ser un número" 
    })
    .int("El ID del rubro debe ser un número entero")
    .positive("El ID del rubro debe ser un número positivo"),
    
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

export const actualizarPostulacionSchema = z.object({
    dni: z.string({ invalid_type_error: "El DNI debe ser texto" })
        .min(7, "El DNI debe tener al menos 7 caracteres")
        .max(10, "El DNI no puede superar los 10 caracteres").optional(),
    
    celular: z.string({ invalid_type_error: "El celular debe ser texto" })
        .min(8, "El celular debe tener al menos 8 caracteres").optional(),
    
    nom_emprend: z.string({ invalid_type_error: "El nombre debe ser texto" })
        .min(3, "El nombre del emprendimiento debe tener al menos 3 caracteres").optional(),
    
    desc_emprend: z.string({ invalid_type_error: "La descripción debe ser texto" })
        .min(10, "La descripción debe tener al menos 10 caracteres").optional(),
    
    trayectoria: z.string({ invalid_type_error: "La trayectoria debe ser texto" }).optional(),
    
    rubroId: z.number({ invalid_type_error: "El ID del rubro debe ser un número" })
        .int("El ID del rubro debe ser un número entero")
        .positive("El ID del rubro debe ser un número positivo").optional(),
    
    provincia: z.string({ invalid_type_error: "La provincia debe ser texto" }).refine((val) => provinciasValidas.includes(val), {
        message: "La provincia ingresada no es válida. Revisa la ortografía."
    }).optional(),
    
    localidad: z.string({ invalid_type_error: "La localidad debe ser texto" }).optional(),
}).refine((datos) => Object.keys(datos).length > 0, {
    message: "Debe enviar al menos un campo para actualizar."
});

export const evaluarPostulacionSchema = z.object({
    std_postulacion: z.enum(['EN_REVISION', 'REVISION_REQUERIDA', 'APROBADA', 'RECHAZADA'], {
        required_error: "El estado de postulación es obligatorio",
        invalid_type_error: "El estado enviado no es válido"
    }),
    observacion: z.string({ invalid_type_error: "La observación debe ser texto" }).nullable().optional()
}).strict();

export const datosPostulacionUsuarioSchema = datosPostulacionSchema.superRefine(validarLocalidad);

export const consultarPostulacionesSchema = z.object({
    estado: z.enum(['PENDIENTE', 'EN_REVISION', 'REVISION_REQUERIDA', 'APROBADA', 'RECHAZADA'], {
        errorMap: () => ({ message: "El estado proporcionado para filtrar no es válido" })
    }).optional(),
    
    nombre: z.string({ invalid_type_error: "El nombre para filtrar debe ser texto" }).optional(),
    dni: z.string({ invalid_type_error: "El DNI para filtrar debe ser texto" }).optional(),
    provincia: z.string({ invalid_type_error: "La provincia para filtrar debe ser texto" }).optional(),
    localidad: z.string({ invalid_type_error: "La localidad para filtrar debe ser texto" }).optional(),
    
    pagina: z.coerce.number({ invalid_type_error: "La página debe ser un número" })
        .int("La página debe ser un número entero")
        .positive("La página debe ser mayor a 0").optional().default(1),
        
    limite: z.coerce.number({ invalid_type_error: "El límite debe ser un número" })
        .int("El límite debe ser un número entero")
        .positive("El límite debe ser mayor a 0").optional().default(10)
});