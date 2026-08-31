import express from 'express'

const app = express()

app.use( express.json() )

const PORT = 3000

app.get( '/', ( req, res ) => {
  res.send( 'Bienvenido a la API REST de gestión del poncho' )
} )

app.use( notFoundMiddleware ) // Middleware de manejo de rutas no encontradas
app.use( errorMiddleware ) // Middleware de manejo de errores, siempre va al ultimo

app.listen( PORT, () => {
  console.log( `Servidor escuchando en el puerto http://localhost:${PORT}` )
} )
