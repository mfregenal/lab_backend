import { crearError } from "../utils/errores.js"

export const validarRubro = ( req, res, next ) => {
  const { nom_rubro } = req.body

  if( typeof nom_rubro !== 'string' || nom_rubro.trim() === '' || !isNaN( nom_rubro ) ) {
    return next( crearError( 'Nombre no valido', 400 ) )
  }

  req.body.nom_rubro = nom_rubro.trim().replace(/\s+/g, ' ')

  next()
}