import { crearError } from '../utils/errores.js'
import prisma from '../config/prisma.js'

export const obtenerRubros = async (req, res, next) => {
  try {
    const { nom_rubro, desc_rubro } = req.query

    const where = {}

    if( nom_rubro ) { where.nom_rubro = { contains: nom_rubro, mode: 'insensitive' } }
    if( desc_rubro ) { where.desc_rubro = { contains: nom_rubro, mode: 'insensitive' } }

    const rubros = await prisma.Rubro.findMany( { where } )

    res.json( rubros )
  } catch ( error ) {
    next( error )
  }
}

export const obtenerRubroPorId = async ( req, res, next ) => {
  try {
    const rubro = await prisma.Rubro.findUnique( { where: { id_rubro: parseInt( req.params.id ) } } )

    if( !rubro ) { return next( crearError( 'Rubro no encontrado', 404 ) ) }

    res.json( rubro )
  } catch ( error ){
    next( error )
  }
}

export const crearRubro = async ( req, res, next ) => {
  try {
    const { nom_rubro, desc_rubro } = req.body

    const nuevoRubro = await prisma.Rubro.create( { data: { nom_rubro, desc_rubro } } )

    res.status( 201 ).json( nuevoRubro )
  } catch ( error ) {
    next( error )
  }
}

export const actualizarRubro = async ( req, res, next ) => {
  try {
    const where = { id_rubro: parseInt( req.params.id ) }
    const rubroExiste = await prisma.rubro.findUnique( { where } )

    if( !rubroExiste ) { return next( crearError( 'Rubro no encontrado', 404 ) ) }

    const { nom_rubro, desc_rubro } = req.body

    const rubroActualizado = await prisma.Rubro.update( {
      where,
      data: { nom_rubro, desc_rubro }
    } )

    res.json( rubroActualizado )
  } catch ( error ) {
    next( error )
  }
}

export const eliminarRubro = async ( req, res, next ) => {
  try{
    const where = { id_rubro: parseInt( req.params.id ) }
    const rubroExiste = await prisma.Rubro.findUnique( { where } )

    if( !rubroExiste ) { return next( crearError( 'Rubro no encontrado', 404 ) ) }

    await prisma.rubro.delete( { where } )

    res.json( { message: 'Rubro eliminado correctamente' } )
  } catch ( error ) {
    next( error )
  }
}