import express from 'express'
import { obtenerConsultas } from '../controllers/consulta.controller.js'
import { validarConsultaConsultas } from '../middlewares/validarConsultaMiddleware.js'
import { autenticarUsuario } from '../middlewares/autenticacion.middleware.js'
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js'

const router = express.Router()

router.get('/',
  /* #swagger.tags = ["Consultas"]
    #swagger.summary = "Listar consultas registradas"
    #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR. Devuelve el registro de consultas paginado, con filtros y orden opcionales."
    #swagger.auto = false
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['pagina'] = { in: 'query', schema: { $ref: "#/components/schemas/Pagina" } }
    #swagger.parameters['limite'] = { in: 'query', schema: { $ref: "#/components/schemas/Limite" } }
    #swagger.parameters['metodo'] = { in: 'query', description: 'Filtra por método HTTP (contiene).', schema: { type: 'string' } }
    #swagger.parameters['endpoint'] = { in: 'query', description: 'Filtra por endpoint (contiene).', schema: { type: 'string' } }
    #swagger.parameters['fechaDesde'] = { in: 'query', description: 'Fecha inicial con formato dd-mm-yyyy.', schema: { type: 'string', example: '01-10-2026' } }
    #swagger.parameters['fechaHasta'] = { in: 'query', description: 'Fecha final con formato dd-mm-yyyy. No puede ser anterior a fechaDesde.', schema: { type: 'string', example: '31-10-2026' } }
    #swagger.parameters['ordenPor'] = { in: 'query', schema: { $ref: "#/components/schemas/OrdenConsultas" } }
    #swagger.parameters['direccion'] = { in: 'query', schema: { $ref: "#/components/schemas/Direccion" } }
    #swagger.responses[200] = { description: "Listado paginado de consultas." }
    #swagger.responses[400] = { description: "Parámetros de consulta inválidos o cabecera Bearer mal formada." }
    #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado." }
    #swagger.responses[403] = { description: "Cuenta inactiva o rol ADMINISTRADOR requerido." }
  */
  autenticarUsuario, autorizarRoles('ADMINISTRADOR'), validarConsultaConsultas, obtenerConsultas)

export default router