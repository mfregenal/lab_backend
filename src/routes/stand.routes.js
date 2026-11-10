import { Router } from "express";
import {
    obtenerStands,
    obtenerStandPorId,
    crearStand,
    actualizarStand,
    eliminarStand
} from "../controllers/stand.controller.js";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import {
    validarCreacionStand,
    validarConsultaStands,
    validarActualizacionStand
} from "../middlewares/validarStandMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js';
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js';
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js';

const router = Router();

// GET /stands (Público con filtros y paginación)
router.get('/', loggerConsultas, validarConsultaStands, /* 
  #swagger.tags = ["Stands"]
  #swagger.summary = "Listar stands con filtros y paginación"
  #swagger.description = "Permite filtrar stands por sector, estado, nombre del emprendimiento asignado o rubro, con ordenamiento y paginación."
  #swagger.parameters['std_stand'] = {
    in: 'query',
    type: 'string',
    enum: ['DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO'],
    required: false,
    description: 'Estado físico del stand'
  }
  #swagger.parameters['sectorId'] = {
    in: 'query',
    type: 'integer',
    required: false,
    description: 'Filtrar por ID del sector'
  }
  #swagger.parameters['nom_emprend'] = {
    in: 'query',
    type: 'string',
    required: false,
    description: 'Buscar por nombre del emprendimiento artesanal'
  }
  #swagger.parameters['rubro'] = {
    in: 'query',
    type: 'string',
    required: false,
    description: 'Buscar por nombre del rubro del artesano'
  }
  #swagger.parameters['pagina'] = {
    in: 'query',
    type: 'integer',
    default: 1,
    required: false,
    description: 'Número de página a consultar'
  }
  #swagger.parameters['limite'] = {
    in: 'query',
    type: 'integer',
    default: 10,
    required: false,
    description: 'Cantidad de elementos por página'
  }
  #swagger.parameters['ordenPor'] = {
    in: 'query',
    type: 'string',
    default: 'id_stand',
    required: false,
    description: 'Campo por el cual ordenar los resultados'
  }
  #swagger.parameters['direccion'] = {
    in: 'query',
    type: 'string',
    enum: ['asc', 'desc'],
    default: 'asc',
    required: false,
    description: 'Dirección del ordenamiento'
  }
  #swagger.responses[200] = {
    description: "Lista paginada de stands obtenida con éxito.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/RespuestaStandsPaginada" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "Criterios de búsqueda o parámetros de paginación inválidos.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[500] = {
    description: "Error interno del servidor.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ obtenerStands);

// GET /stands/:id (Público)
router.get('/:id', validarId, /* 
  #swagger.tags = ["Stands"]
  #swagger.summary = "Obtener un stand por ID"
  #swagger.description = "Retorna el detalle completo del stand con su sector, pabellón y datos del artesano si está asignado."
  #swagger.parameters['id'] = {
    in: 'path',
    type: 'integer',
    required: true,
    description: 'Identificador único del stand'
  }
  #swagger.responses[200] = {
    description: "Stand encontrado con éxito.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/StandDetalle" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "ID de stand inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "Stand no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ obtenerStandPorId);

// POST /stands (Protegido - ADMINISTRADOR)
router.post('/', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarCreacionStand, /* 
  #swagger.tags = ["Stands"]
  #swagger.summary = "Crear un nuevo stand"
  #swagger.description = "Registra un stand en un sector. Si no se indica std_stand, queda DISPONIBLE para poder asignarse; también puede crearse en MANTENIMIENTO. Requiere token Bearer con rol ADMINISTRADOR."
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.auto = false
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/NuevoStand" }
      }
    }
  }
  #swagger.responses[201] = {
    description: "Stand creado exitosamente.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/StandDetalle" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "Cuerpo inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[401] = {
    description: "Token ausente o inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[403] = {
    description: "Acceso denegado: se requiere rol ADMINISTRADOR.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "El sector indicado no existe.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[409] = {
    description: "Conflicto: ya existe un stand registrado con ese código.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ crearStand);

// PUT /stands/:id (Protegido - ADMINISTRADOR)
router.put('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, validarActualizacionStand, /* 
  #swagger.tags = ["Stands"]
  #swagger.summary = "Actualizar datos de un stand"
  #swagger.description = "Modifica los datos de un stand existente. El estado debe ser coherente con la asignación: OCUPADO solo si tiene un artesano asignado, y un stand con artesano debe permanecer OCUPADO. Requiere rol ADMINISTRADOR."
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.auto = false
  #swagger.parameters['id'] = {
    in: 'path',
    type: 'integer',
    required: true,
    description: 'Identificador del stand a actualizar'
  }
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/NuevoStand" }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Stand actualizado exitosamente.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/StandDetalle" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "Datos o ID de stand inválidos.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[401] = {
    description: "Token ausente o inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[403] = {
    description: "Acceso denegado: se requiere rol ADMINISTRADOR.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "Stand o Sector asociado no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[409] = {
    description: "Conflicto: el código ya está en uso por otro stand, o el estado indicado contradice la asignación del artesano.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ actualizarStand);

// DELETE /stands/:id (Protegido - ADMINISTRADOR)
router.delete('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, /* 
  #swagger.tags = ["Stands"]
  #swagger.summary = "Eliminar un stand"
  #swagger.description = "Elimina un stand por su ID. Requiere rol ADMINISTRADOR."
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id'] = {
    in: 'path',
    type: 'integer',
    required: true,
    description: 'Identificador del stand a eliminar'
  }
  #swagger.responses[204] = {
    description: "Stand eliminado exitosamente (sin contenido)."
  }
  #swagger.responses[400] = {
    description: "ID de stand inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[401] = {
    description: "Token ausente o inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[403] = {
    description: "Acceso denegado: se requiere rol ADMINISTRADOR.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "Stand no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ eliminarStand);

export default router;