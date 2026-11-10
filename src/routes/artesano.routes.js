import express from 'express';
import {
  obtenerArtesanos,
  obtenerArtesanosPublicos,
  obtenerArtesanoId,
  asignarStand,
  actualizarArtesano,
  eliminarArtesano
} from '../controllers/artesano.controller.js';
import { validarConsultaArtesanos, validarAsignacionStand } from '../middlewares/validarArtesanoMiddleware.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js';
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js';

const router = express.Router();

router.get('/', 
    /* 
    #swagger.tags = ['Artesanos']
    #swagger.summary = 'Obtener todos los artesanos'
    #swagger.description = 'Devuelve una lista de los artesanos registrados. Requiere token activo y rol de ADMINISTRADOR.'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = { description: 'Lista de artesanos obtenida exitosamente.' }
    #swagger.responses[400] = { description: 'Parámetros de consulta inválidos.' }
    #swagger.responses[401] = { description: 'Token ausente, inválido, vencido o revocado.' }
    #swagger.responses[403] = { description: 'Acceso denegado. Se requiere rol de ADMINISTRADOR.' }
    */
    autenticarUsuario, 
    autorizarRoles('ADMINISTRADOR'), 
    loggerConsultas, 
    validarConsultaArtesanos, 
    obtenerArtesanos
);

// Debe declararse antes de '/:id'; de lo contrario "publicos" se interpretaría como un id.
router.get('/publicos',
    /*
    #swagger.tags = ['Artesanos']
    #swagger.summary = 'Listar artesanos (público)'
    #swagger.description = 'Listado público de artesanos aprobados, con paginación y filtros. Devuelve solo nombre, apellido, emprendimiento, rubro, provincia, localidad y código de stand. No requiere token.'
    #swagger.security = []
    #swagger.parameters['nombre'] = { in: 'query', type: 'string', description: 'Filtrar por nombre' }
    #swagger.parameters['apellido'] = { in: 'query', type: 'string', description: 'Filtrar por apellido' }
    #swagger.parameters['rubro'] = { in: 'query', type: 'string', description: 'Filtrar por rubro' }
    #swagger.parameters['provincia'] = { in: 'query', type: 'string', description: 'Filtrar por provincia' }
    #swagger.parameters['localidad'] = { in: 'query', type: 'string', description: 'Filtrar por localidad' }
    #swagger.parameters['stand'] = { in: 'query', type: 'string', description: 'Filtrar por código de stand' }
    #swagger.parameters['pagina'] = { in: 'query', schema: { $ref: '#/components/schemas/Pagina' } }
    #swagger.parameters['limite'] = { in: 'query', schema: { $ref: '#/components/schemas/Limite' } }
    #swagger.responses[200] = { description: 'Lista pública de artesanos obtenida exitosamente.' }
    #swagger.responses[400] = { description: 'Parámetros de consulta inválidos.' }
    */
    loggerConsultas,
    validarConsultaArtesanos,
    obtenerArtesanosPublicos
);

router.get('/:id',
    /*
    #swagger.tags = ['Artesanos']
    #swagger.summary = 'Obtener un artesano por ID'
    #swagger.description = 'Busca y devuelve los detalles de un perfil de artesano. Requiere rol de ARTESANO o ADMINISTRADOR.'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = { in: 'path', description: 'ID del artesano' }
    #swagger.responses[200] = { description: 'Artesano encontrado.' }
    #swagger.responses[400] = { description: 'ID inválido.' }
    #swagger.responses[401] = { description: 'Token ausente, inválido, vencido o revocado.' }
    #swagger.responses[403] = { description: 'Acceso denegado. Se requiere rol de ARTESANO o ADMINISTRADOR.' }
    #swagger.responses[404] = { description: 'El artesano no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ARTESANO', 'ADMINISTRADOR'), 
    validarId, 
    obtenerArtesanoId
);

router.post('/:id/stand', 
    /* 
    #swagger.tags = ['Artesanos']
    #swagger.summary = 'Asignar stand a un artesano'
    #swagger.description = 'Permite asignar un stand específico a un artesano. Exclusivo para ADMINISTRADOR.'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = { in: 'path', description: 'ID del artesano al que se le asignará el stand' }
    
    #swagger.requestBody = {
        required: true,
        content: { 
            "application/json": { 
                schema: {
                    $ref: "#/components/schemas/AsignacionStand" 
                }
            }
        }
    }
    
    #swagger.responses[200] = { description: 'Stand asignado exitosamente.' }
    #swagger.responses[400] = { description: 'Datos de asignación inválidos.' }
    #swagger.responses[401] = { description: 'Token ausente o inválido.' }
    #swagger.responses[403] = { description: 'Acceso denegado. Exclusivo para ADMINISTRADOR.' }
    #swagger.responses[404] = { description: 'El artesano no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ADMINISTRADOR'), 
    validarId, 
    validarAsignacionStand, 
    asignarStand
);

router.put('/:id', 
    /* 
    #swagger.tags = ['Artesanos']
    #swagger.summary = 'Actualizar datos del artesano'
    #swagger.description = 'Permite modificar la información del perfil del artesano. Requiere rol de ARTESANO o ADMINISTRADOR.'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = { in: 'path', description: 'ID del perfil de artesano a actualizar' }
    
    #swagger.requestBody = {
        required: true,
        content: { 
            "application/json": { 
                schema: {
                    $ref: "#/components/schemas/ActualizarArtesano" 
                }
            }
        }
    }
    
    #swagger.responses[200] = { description: 'Perfil de artesano actualizado exitosamente.' }
    #swagger.responses[400] = { description: 'Cuerpo de la petición inválido.' }
    #swagger.responses[401] = { description: 'Token ausente o inválido.' }
    #swagger.responses[403] = { description: 'Acceso denegado.' }
    #swagger.responses[404] = { description: 'El artesano no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ARTESANO', 'ADMINISTRADOR'), 
    validarId, 
    actualizarArtesano
);

router.delete('/:id', 
    /* 
    #swagger.tags = ['Artesanos']
    #swagger.summary = 'Eliminar un perfil de artesano'
    #swagger.description = 'Elimina un artesano del sistema. Exclusivo para ADMINISTRADOR.'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = { in: 'path', description: 'ID del artesano a eliminar' }
    #swagger.responses[200] = { description: 'Artesano eliminado exitosamente.' }
    #swagger.responses[400] = { description: 'ID inválido.' }
    #swagger.responses[401] = { description: 'Token ausente o inválido.' }
    #swagger.responses[403] = { description: 'Acceso denegado. Exclusivo para ADMINISTRADOR.' }
    #swagger.responses[404] = { description: 'El artesano no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ADMINISTRADOR'), 
    validarId, 
    eliminarArtesano
);

export default router;