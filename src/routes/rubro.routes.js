import express from "express"
import { obtenerRubros, obtenerRubroPorId, crearRubro, actualizarRubro, eliminarRubro } from "../controllers/rubro.controller.js"
import { validarId } from "../middlewares/validarIdMiddleware.js"
import { validarCreacionRubro, validarActualizacionRubro, validarConsultaRubro } from '../middlewares/validarRubroMiddleware.js'
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js'
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js'

const router = express.Router()

router.get('/',
  /* #swagger.tags = ["Rubros"]
    #swagger.summary = "Listar rubros"
    #swagger.description = "Operación pública. Devuelve los rubros paginados, con filtros y orden opcionales."
    #swagger.auto = false
    #swagger.parameters['pagina'] = { in: 'query', schema: { $ref: "#/components/schemas/Pagina" } }
    #swagger.parameters['limite'] = { in: 'query', schema: { $ref: "#/components/schemas/Limite" } }
    #swagger.parameters['nom_rubro'] = { in: 'query', description: 'Filtra por nombre (contiene, sin distinguir mayúsculas).', schema: { type: 'string' } }
    #swagger.parameters['desc_rubro'] = { in: 'query', description: 'Filtra por descripción (contiene, sin distinguir mayúsculas).', schema: { type: 'string' } }
    #swagger.parameters['ordenPor'] = { in: 'query', schema: { $ref: "#/components/schemas/OrdenRubros" } }
    #swagger.parameters['direccion'] = { in: 'query', schema: { $ref: "#/components/schemas/Direccion" } }
    #swagger.responses[200] = { description: "Listado paginado de rubros." }
    #swagger.responses[400] = { description: "Parámetros de consulta inválidos." }
  */
  loggerConsultas, validarConsultaRubro, obtenerRubros)

router.get('/:id',
  /* #swagger.tags = ["Rubros"]
    #swagger.summary = "Obtener un rubro"
    #swagger.description = "Operación pública."
    #swagger.auto = false
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { $ref: "#/components/schemas/IdRuta" } }
    #swagger.responses[200] = { description: "Rubro encontrado." }
    #swagger.responses[400] = { description: "ID inválido." }
    #swagger.responses[404] = { description: "Rubro inexistente." }
  */
  validarId, obtenerRubroPorId)

router.post('/',
  /* #swagger.tags = ["Rubros"]
    #swagger.summary = "Crear un rubro"
    #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/NuevoRubro" } } } }
    #swagger.responses[201] = { description: "Rubro creado." }
    #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[409] = { description: "El nombre del rubro ya existe." }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarCreacionRubro, crearRubro)

router.put('/:id',
  /* #swagger.tags = ["Rubros"]
    #swagger.summary = "Actualizar un rubro"
    #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR. Admite actualización parcial."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { $ref: "#/components/schemas/IdRuta" } }
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizacionRubro" } } } }
    #swagger.responses[200] = { description: "Rubro actualizado." }
    #swagger.responses[400] = { description: "ID o cuerpo inválido, o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Rubro inexistente." }
    #swagger.responses[409] = { description: "El nombre del rubro ya existe." }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, validarActualizacionRubro, actualizarRubro)

router.delete('/:id',
  /* #swagger.tags = ["Rubros"]
    #swagger.summary = "Eliminar un rubro"
    #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { $ref: "#/components/schemas/IdRuta" } }
    #swagger.responses[200] = { description: "Rubro eliminado." }
    #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
    #swagger.responses[404] = { description: "Rubro inexistente." }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarId, eliminarRubro)

export default router