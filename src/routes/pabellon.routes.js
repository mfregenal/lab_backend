import { Router } from "express";
import {
    obtenerPabellones,
    obtenerPabellonPorId,
    eliminarPabellon,
    crearPabellon,
    actualizarPabellon
} from "../controllers/pabellon.controller.js";
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { validarPabellonCreacion } from "../middlewares/validarCreacionPabellonMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js';
import { validarPabellonActualizacion } from "../middlewares/validarActualizacionPabellonMiddleware.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware.js";

const router = Router();

// GET /pabellones (Público)
router.get('/', loggerConsultas, /* 
  #swagger.tags = ["Pabellones"]
  #swagger.summary = "Listar todos los pabellones"
  #swagger.description = "Obtiene la lista completa de pabellones físicos registrados en el predio ferial."
  #swagger.responses[200] = {
    description: "Lista de pabellones obtenida exitosamente.",
    content: {
      "application/json": {
        schema: { type: "array", items: { $ref: "#/components/schemas/PabellonDetalle" } }
      }
    }
  }
  #swagger.responses[500] = {
    description: "Error interno del servidor.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ obtenerPabellones);

// GET /pabellones/:id (Público)
router.get('/:id', validarId, /* 
  #swagger.tags = ["Pabellones"]
  #swagger.summary = "Obtener pabellón por ID"
  #swagger.description = "Retorna los datos específicos de un pabellón por su identificador numérico."
  #swagger.parameters['id'] = {
    in: 'path',
    type: 'integer',
    required: true,
    description: 'Identificador único del pabellón'
  }
  #swagger.responses[200] = {
    description: "Pabellón encontrado.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/PabellonDetalle" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "ID de pabellón inválido.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "Pabellón no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ obtenerPabellonPorId);

// POST /pabellones (Protegido - ADMINISTRADOR)
router.post('/', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarPabellonCreacion, /* 
  #swagger.tags = ["Pabellones"]
  #swagger.summary = "Crear un nuevo pabellón"
  #swagger.description = "Crea un pabellón en el sistema. Requiere token Bearer con rol ADMINISTRADOR."
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.auto = false
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/NuevoPabellon" }
      }
    }
  }
  #swagger.responses[201] = {
    description: "Pabellón creado con éxito.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/PabellonDetalle" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "Cuerpo de solicitud inválido o campos obligatorios ausentes.",
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
  #swagger.responses[409] = {
    description: "Conflicto: ya existe un pabellón con ese nombre.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ crearPabellon);

// PUT /pabellones/:id (Protegido - ADMINISTRADOR)
router.put('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, validarPabellonActualizacion, /* 
  #swagger.tags = ["Pabellones"]
  #swagger.summary = "Actualizar datos de un pabellón"
  #swagger.description = "Modifica los datos de un pabellón existente. Requiere token Bearer con rol ADMINISTRADOR."
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.auto = false
  #swagger.parameters['id'] = {
    in: 'path',
    type: 'integer',
    required: true,
    description: 'Identificador del pabellón a modificar'
  }
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/NuevoPabellon" }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Pabellón actualizado exitosamente.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/PabellonDetalle" }
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
    description: "Pabellón no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ actualizarPabellon);

// DELETE /pabellones/:id (Protegido - ADMINISTRADOR)
router.delete('/:id', autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, /* 
  #swagger.tags = ["Pabellones"]
  #swagger.summary = "Eliminar un pabellón"
  #swagger.description = "Elimina un pabellón por su ID. Requiere rol ADMINISTRADOR."
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id'] = {
    in: 'path',
    type: 'integer',
    required: true,
    description: 'Identificador del pabellón a eliminar'
  }
  #swagger.responses[204] = {
    description: "Pabellón eliminado correctamente (sin contenido)."
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
    description: "Acceso denegado: se requiere rol ADMINISTRADOR.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[404] = {
    description: "Pabellón no encontrado.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ eliminarPabellon);

export default router;