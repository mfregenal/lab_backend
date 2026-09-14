import express from 'express'
import artesanoRoutes from './routes/artesano.routes.js'
import productosRoutes from './routes/productos.routes.js'
import pabellonRoutes from './routes/pabellon.routes.js'
import sectorRoutes from './routes/sector.routes.js'
import standRoutes from './routes/stand.routes.js'
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'

const app = express()

app.use( express.json() )

const PORT = 3000

// Rutas de ambos módulos
app.use('/artesanos', artesanoRoutes)
app.use('/productos', productosRoutes)
app.use('/pabellones', pabellonRoutes)
app.use('/sectores', sectorRoutes)
app.use('/stands', standRoutes)

app.get( '/', ( req, res ) => {
  res.send( 'Bienvenido a la API REST de gestión del poncho' )
} )

// Middlewares de error siempre al final
app.use( notFoundMiddleware )
app.use( errorMiddleware )

app.listen( PORT, () => {
  console.log( `Servidor escuchando en el puerto http://localhost:${PORT}` )
} )