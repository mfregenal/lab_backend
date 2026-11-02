import express from 'express';
import { obtenerProductos, obtenerProductoId, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/producto.controller.js';
import { validarCreacionProducto, validarConsultaProductos, validarActualizacionProducto } from '../middlewares/validarProductoMiddleware.js';
import { validarId } from "../middlewares/validarIdMiddleware.js";
import { loggerConsultas } from '../middlewares/loggerConsultasMiddleware.js'
import { autenticarUsuario, autenticarUsuarioOpcional } from '../middlewares/autenticacion.middleware.js';
import { autorizarRoles } from '../middlewares/autorizacion.middleware.js';

const router = express.Router();

router.get('/', 
    /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Obtener todos los productos'
    #swagger.description = 'Devuelve una lista de todos los productos. Soporta autenticación opcional.'
    #swagger.responses[200] = { description: 'Lista de productos obtenida exitosamente.' }
    #swagger.responses[400] = { description: 'Parámetros de consulta inválidos.' }
    */
    autenticarUsuarioOpcional, 
    loggerConsultas, 
    validarConsultaProductos, 
    obtenerProductos
);

router.get('/:id', 
    /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Obtener un producto por ID'
    #swagger.description = 'Busca y devuelve los detalles de un producto específico.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID del producto' }
    #swagger.responses[200] = { description: 'Producto encontrado.' }
    #swagger.responses[400] = { description: 'ID inválido.' }
    #swagger.responses[404] = { description: 'El producto no existe.' }
    */
    autenticarUsuarioOpcional, 
    validarId, 
    obtenerProductoId
);

router.post('/',
    /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Cargar un nuevo producto'
    #swagger.description = 'Requiere token JWT activo y rol de ARTESANO o ADMINISTRADOR.'
    
    #swagger.requestBody = {
        required: true,
        content: { 
            "application/json": { 
                schema: {
                    $ref: "#/components/schemas/NuevoProducto" 
                }
            }
        }
    }
    
    #swagger.responses[201] = {  description: 'Producto creado exitosamente.' }
    #swagger.responses[400] = { description: 'Cuerpo inválido. Faltan datos o no cumplen el formato (Validación Zod).' }
    #swagger.responses[401] = { description: 'Token ausente, inválido, vencido o revocado.' }
    #swagger.responses[403] = { description: 'Cuenta inactiva o no tiene rol de ARTESANO / ADMINISTRADOR.' }
    */
    autenticarUsuario,
    autorizarRoles('ARTESANO', 'ADMINISTRADOR'),
    validarCreacionProducto,
    crearProducto
);

router.put('/:id', 
    /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Actualizar un producto existente'
    #swagger.description = 'Permite modificar los datos de un producto. Requiere token JWT y rol de ARTESANO o ADMINISTRADOR.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID del producto a actualizar' }
    
    #swagger.requestBody = {
        required: true,
        content: { 
            "application/json": { 
                schema: {
                    $ref: "#/components/schemas/NuevoProducto" 
                }
            }
        }
    }
    
    #swagger.responses[200] = { description: 'Producto actualizado exitosamente.' }
    #swagger.responses[400] = { description: 'ID o cuerpo inválido.' }
    #swagger.responses[401] = { description: 'Token ausente, inválido, vencido o revocado.' }
    #swagger.responses[403] = { description: 'Cuenta inactiva o sin permisos suficientes.' }
    #swagger.responses[404] = { description: 'El producto no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ARTESANO', 'ADMINISTRADOR'), 
    validarId, 
    validarActualizacionProducto, 
    actualizarProducto
);

router.delete('/:id', 
    /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Eliminar un producto'
    #swagger.description = 'Borra un producto de la base de datos. Requiere token JWT y rol de ARTESANO o ADMINISTRADOR.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID del producto a eliminar' }
    #swagger.responses[200] = { description: 'Producto eliminado exitosamente.' }
    #swagger.responses[400] = { description: 'ID inválido.' }
    #swagger.responses[401] = { description: 'Token ausente, inválido, vencido o revocado.' }
    #swagger.responses[403] = { description: 'Cuenta inactiva o sin permisos suficientes.' }
    #swagger.responses[404] = { description: 'El producto no existe.' }
    */
    autenticarUsuario, 
    autorizarRoles('ARTESANO', 'ADMINISTRADOR'), 
    validarId, 
    eliminarProducto
);

export default router;