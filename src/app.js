import express from 'express'
import artesanoRoutes from './routes/artesano.routes.js'
import productosRoutes from './routes/producto.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'
import rubroRoutes from './routes/rubro.routes.js'
import postulacionRoutes from './routes/postulacion.routes.js'  
import pabellonRoutes from './routes/pabellon.routes.js'
import sectorRoutes from './routes/sector.routes.js'
import standRoutes from './routes/stand.routes.js'
import consultaRoutes from './routes/consulta.routes.js'
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import { loggerConsultas } from './middlewares/loggerConsultasMiddleware.js'

const app = express()

app.use( express.json() )

app.use( loggerConsultas )

const PORT = 3000

// Rutas de ambos módulos
app.use('/artesanos', artesanoRoutes)
app.use('/productos', productosRoutes)
app.use( '/usuarios', usuarioRoutes )
app.use( '/rubros', rubroRoutes )
app.use( '/consultas', consultaRoutes )
app.use( '/postulacion', postulacionRoutes )
app.use('/pabellones', pabellonRoutes)
app.use('/sectores', sectorRoutes)
app.use('/stands', standRoutes)

// Bienvenida
app.get( '/', ( req, res ) => {
  res.send( 'Bienvenido a la API REST de gestión del poncho' )
} )

app.use( notFoundMiddleware ) // Middleware para manejar rutas no encontradas
app.use( errorMiddleware ) // Middleware para manejar errores

app.listen( PORT, () => {
  console.log( `Servidor escuchando en el puerto http://localhost:${PORT}` )
} )