import express from 'express'
import artesanoRoutes from './routes/artesano.routes.js'
import productosRoutes from './routes/productos.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'

const app = express()

app.use( express.json() )

const PORT = 3000

// Rutas de ambos módulos
app.use('/artesanos', artesanoRoutes)
app.use('/productos', productosRoutes)
app.use( '/usuario', usuarioRoutes )

// Bienvenida
app.get( '/', ( req, res ) => {
  res.send( 'Bienvenido a la API REST de gestión del poncho' )
} )

app.use( notFoundMiddleware ) // Middleware para manejar rutas no encontradas
app.use( errorMiddleware ) // Middleware para manejar errores

app.listen( PORT, () => {
  console.log( `Servidor escuchando en el puerto http://localhost:${PORT}` )
} )