import { Router } from 'express';
import { obtenerProvincias, obtenerLocalidades } from '../controllers/ubicacion.controller.js';

const router = Router();

// GET /provincias (Público)
router.get('/provincias', /* 
  #swagger.tags = ["Ubicaciones"]
  #swagger.summary = "Listar provincias disponibles"
  #swagger.description = "Devuelve el listado ordenado y sin duplicados de las provincias argentinas disponibles para la carga de postulaciones."
  #swagger.responses[200] = {
    description: "Listado de provincias obtenido con éxito.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ListadoProvincias" }
      }
    }
  }
  #swagger.responses[500] = {
    description: "Error interno al cargar las provincias.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ obtenerProvincias);

// GET /localidades/:provincia (Público)
router.get('/localidades/:provincia', /* 
  #swagger.tags = ["Ubicaciones"]
  #swagger.summary = "Listar localidades por provincia"
  #swagger.description = "Devuelve el listado de localidades correspondientes a la provincia ingresada en el parámetro de ruta."
  #swagger.parameters['provincia'] = {
    in: 'path',
    type: 'string',
    required: true,
    description: 'Nombre de la provincia a consultar (ej: Catamarca)'
  }
  #swagger.responses[200] = {
    description: "Listado de localidades obtenido con éxito.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ListadoLocalidades" }
      }
    }
  }
  #swagger.responses[404] = {
    description: "No se encontraron localidades para la provincia indicada.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
  #swagger.responses[500] = {
    description: "Error interno al cargar las localidades.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
  }
*/ obtenerLocalidades);

export default router;