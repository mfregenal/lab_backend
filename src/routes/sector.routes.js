import { Router } from "express";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import {
    obtenerSectores,
    obtenerSectorPorId,
    crearSector,
    actualizarSector,
    eliminarSector
} from "../controllers/sector.controller.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js';
import { validarSectorCreacion } from "../middlewares/validarCreacionSectorMiddleware.js";
import { validarSectorActualizacion } from "../middlewares/validarActualizacionSectorMiddleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware.js";

const router = Router();

// GET /sectores (Público con posible uso de filtro por pabellón)
router.get('/', loggerConsultas, /* 
  #swagger.tags = ["Sectores"]
  #swagger.summary = "Listar sectores"
  #swagger.description = "Devuelve todos los sectores registrados en el predio ferial, con opción de filtrar por pabellón."
  #swagger.parameters['pabellonId'] = {
    in: 'query',
    type: 'integer',
    required: false,
    description: 'Filtrar sectores pertenecientes a un pabellón específico'
  }
  #swagger.responses[200] = {
    description: "Listado de sectores obtenido con éxito.",
    content: {
      "application/json": {
        schema: { type: "array", items: { $ref: "#/components/schemas/SectorDetalle" } }
      }
    }
  }
  #swagger.responses[500] = {
    description: "Error interno del servidor al consultar sectores.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ obtenerSectores);

// GET /sectores/:id (Público)
router.get('/:id', validarId, /* 
  #swagger.tags = ["Sectores"]
  #swagger.summary = "Obtener un sector por ID"
  #swagger.description = "Retorna el detalle de un sector y sus datos asociados."
  #swagger.parameters['id'] = {
    in: 'path',
    type: 'integer',
    required: true,
    description: 'Identificador único del sector'
  }
  #swagger.responses[200] = {
    description: "Sector encontrado exitosamente.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/SectorDetalle" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "ID de sector inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "Sector no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ obtenerSectorPorId);

// POST /sectores (Protegido - ADMINISTRADOR)
router.post('/', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarSectorCreacion, /* 
  #swagger.tags = ["Sectores"]
  #swagger.summary = "Crear un nuevo sector"
  #swagger.description = "Da de alta un sector dentro de un pabellón. Requiere token Bearer con rol ADMINISTRADOR."
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.auto = false
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/NuevoSector" }
      }
    }
  }
  #swagger.responses[201] = {
    description: "Sector creado con éxito.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/SectorDetalle" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "Datos inválidos o pabellonId faltante.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[401] = {
    description: "Token ausente, inválido o revocado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[403] = {
    description: "Acceso denegado: rol ADMINISTRADOR requerido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "El pabellón indicado en pabellonId no existe.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ crearSector);

// PUT /sectores/:id (Protegido - ADMINISTRADOR)
router.put('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, validarSectorActualizacion, /* 
  #swagger.tags = ["Sectores"]
  #swagger.summary = "Actualizar datos de un sector"
  #swagger.description = "Modifica los datos de un sector existente. Requiere token Bearer con rol ADMINISTRADOR."
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.auto = false
  #swagger.parameters['id'] = {
    in: 'path',
    type: 'integer',
    required: true,
    description: 'Identificador del sector a modificar'
  }
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/NuevoSector" }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Sector actualizado exitosamente.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/SectorDetalle" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "Datos o ID inválidos.",
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
    description: "Sector o Pabellón asociado no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[409] = {
    description: "Conflicto: ya existe otro sector con ese nombre en este pabellón.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ actualizarSector);

// DELETE /sectores/:id (Protegido - ADMINISTRADOR)
router.delete('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, /* 
  #swagger.tags = ["Sectores"]
  #swagger.summary = "Eliminar un sector"
  #swagger.description = "Elimina un sector por su ID. Requiere rol ADMINISTRADOR."
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id'] = {
    in: 'path',
    type: 'integer',
    required: true,
    description: 'Identificador del sector a eliminar'
  }
  #swagger.responses[204] = {
    description: "Sector eliminado con éxito (sin contenido)."
  }
  #swagger.responses[400] = {
    description: "ID inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[401] = {
    description: "Token ausente o inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[403] = {
    description: "Acceso denegado: rol ADMINISTRADOR requerido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "Sector no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ eliminarSector);

export default router;