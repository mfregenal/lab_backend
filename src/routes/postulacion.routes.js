import express from 'express';
import { obtenerPostulaciones, obtenerPostulacionId, /* crearPostulacion */ actualizarPostulacion, eliminarPostulacion } from '../controllers/postulacion.controller.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarActualizacionPostulacion, validarConsultaPostulaciones, validarEvaluacionPostulacion } from "../middlewares/validarPostulacionMiddleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware.js";

const router = express.Router();

router.get('/', 
    /* 
    #swagger.tags = ['Postulaciones']
    #swagger.summary = 'Obtener todas las postulaciones'
    #swagger.description = 'Devuelve una lista de postulaciones. Requiere token activo y rol de ARTESANO o ADMINISTRADOR.'
    #swagger.responses[200] = { description: 'Lista de postulaciones obtenida exitosamente.' }
    #swagger.responses[400] = { description: 'Parámetros de consulta inválidos.' }
    #swagger.responses[401] = { description: 'Token ausente, inválido, vencido o revocado.' }
    #swagger.responses[403] = { description: 'Acceso denegado. Se requiere rol de ARTESANO o ADMINISTRADOR.' }
    */
    autenticarUsuario, 
    autorizarRoles('ARTESANO', 'ADMINISTRADOR'), 
    validarConsultaPostulaciones, 
    obtenerPostulaciones
);

router.get('/:id', 
    /* 
    #swagger.tags = ['Postulaciones']
    #swagger.summary = 'Obtener una postulación por ID'
    #swagger.description = 'Busca y devuelve los detalles de una postulación específica. Requiere rol de ARTESANO o ADMINISTRADOR.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la postulación' }
    #swagger.responses[200] = { description: 'Postulación encontrada.' }
    #swagger.responses[400] = { description: 'ID inválido.' }
    #swagger.responses[401] = { description: 'Token ausente o inválido.' }
    #swagger.responses[403] = { description: 'Acceso denegado. Se requiere rol de ARTESANO o ADMINISTRADOR.' }
    #swagger.responses[404] = { description: 'La postulación no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ARTESANO', 'ADMINISTRADOR'), 
    validarId, 
    obtenerPostulacionId
);

router.put('/:id', 
    /* 
    #swagger.tags = ['Postulaciones']
    #swagger.summary = 'Actualizar datos de una postulación'
    #swagger.description = 'Permite modificar la información de una postulación (ej. actualizar provincia o trayectoria). Requiere rol de ARTESANO o ADMINISTRADOR.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la postulación a actualizar' }
    
    #swagger.requestBody = {
        required: true,
        content: { 
            "application/json": { 
                schema: {
                    $ref: "#/components/schemas/ActualizarPostulacion" 
                }
            }
        }
    }
    
    #swagger.responses[200] = { description: 'Postulación actualizada exitosamente.' }
    #swagger.responses[400] = { description: 'Cuerpo de la petición inválido.' }
    #swagger.responses[401] = { description: 'Token ausente o inválido.' }
    #swagger.responses[403] = { description: 'Acceso denegado.' }
    #swagger.responses[404] = { description: 'La postulación no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ARTESANO', 'ADMINISTRADOR'), 
    validarId, 
    validarActualizacionPostulacion, 
    actualizarPostulacion
);

router.put('/:id/evaluar', 
    /* 
    #swagger.tags = ['Postulaciones']
    #swagger.summary = 'Evaluar una postulación (Aprobar/Rechazar)'
    #swagger.description = 'Permite cambiar el estado de evaluación de la postulación. Exclusivo para ADMINISTRADOR.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la postulación a evaluar' }
    
    #swagger.requestBody = {
        required: true,
        content: { 
            "application/json": { 
                schema: {
                    $ref: "#/components/schemas/EvaluarPostulacion" 
                }
            }
        }
    }
    
    #swagger.responses[200] = { description: 'Estado de postulación actualizado exitosamente.' }
    #swagger.responses[400] = { description: 'Datos de evaluación inválidos (ej. estado no permitido).' }
    #swagger.responses[401] = { description: 'Token ausente o inválido.' }
    #swagger.responses[403] = { description: 'Acceso denegado. Exclusivo para ADMINISTRADOR.' }
    #swagger.responses[404] = { description: 'La postulación no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ADMINISTRADOR'), 
    validarId, 
    validarEvaluacionPostulacion, 
    actualizarPostulacion
);

router.delete('/:id', 
    /* 
    #swagger.tags = ['Postulaciones']
    #swagger.summary = 'Eliminar una postulación'
    #swagger.description = 'Elimina una postulación del sistema. Exclusivo para ADMINISTRADOR.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la postulación a eliminar' }
    #swagger.responses[200] = { description: 'Postulación eliminada exitosamente.' }
    #swagger.responses[400] = { description: 'ID inválido.' }
    #swagger.responses[401] = { description: 'Token ausente o inválido.' }
    #swagger.responses[403] = { description: 'Acceso denegado. Exclusivo para ADMINISTRADOR.' }
    #swagger.responses[404] = { description: 'La postulación no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ADMINISTRADOR'), 
    validarId, 
    eliminarPostulacion
);

export default router;