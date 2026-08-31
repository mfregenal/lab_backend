import express from 'express'
import productosRoutes from './routes/productos.routes.js'
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'

const app = express()

app.use( express.json() )

const PORT = 3000

app.use("/productos", productosRoutes)

app.get( '/', ( req, res ) => {
  res.send( 'Bienvenido a la API REST de gestión del poncho' )
} )

app.use( notFoundMiddleware ) // Middleware de manejo de rutas no encontradas
app.use( errorMiddleware ) // Middleware de manejo de errores, siempre va al ultimo

app.listen( PORT, () => {
  console.log( `Servidor escuchando en el puerto http://localhost:${PORT}` )
} )
