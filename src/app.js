import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'node:fs'
import "./config/jwt.js";
import { iniciarLimpiezaRevocaciones } from "./tareas/limpiezaRevocaciones.js";

import artesanoRoutes from './routes/artesano.routes.js'
import productosRoutes from './routes/producto.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'
import rubroRoutes from './routes/rubro.routes.js'
import postulacionRoutes from './routes/postulacion.routes.js'  
import pabellonRoutes from './routes/pabellon.routes.js'
import sectorRoutes from './routes/sector.routes.js'
import standRoutes from './routes/stand.routes.js'
import consultaRoutes from './routes/consulta.routes.js'
import ubicacionesRoutes from './routes/ubicacion.routes.js';

import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'


const app = express()

app.use( express.json() )

const PORT = Number(process.env.PORT) || 3000

const swaggerDocument = JSON.parse(
  readFileSync(new URL('../swagger-output.json', import.meta.url), 'utf8')
)

// Rutas de ambos módulos
app.use('/artesanos', artesanoRoutes)
app.use('/productos', productosRoutes)
app.use('/usuarios', usuarioRoutes)
app.use('/rubros', rubroRoutes)
app.use('/consultas', consultaRoutes)
app.use('/postulaciones', postulacionRoutes)
app.use('/pabellones', pabellonRoutes)
app.use('/sectores', sectorRoutes)
app.use('/stands', standRoutes)
app.use('/api/ubicaciones', ubicacionesRoutes);

// 1.1: Swagger UI se publica en /docs, antes del manejador 404 (notFoundMiddleware).
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Bienvenida
app.get( '/', ( req, res ) => {
  res.send( 'Bienvenido a la API REST de gestión del poncho' )
} )

app.use( notFoundMiddleware ) // Middleware para manejar rutas no encontradas
app.use( errorMiddleware ) // Middleware para manejar errores

if (process.env.NODE_ENV !== "test")
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
    iniciarLimpiezaRevocaciones();
  });

export default app;