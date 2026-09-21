import * as RubroService from '../services/rubro.service.js'

export const obtenerRubros = async (req, res, next) => {
  try {
    // Se consume req.queryValido generado en el middleware
    const resultado = await RubroService.obtenerTodos(req.queryValido)
    res.json(resultado)
  } catch (error) { next(error) }
}

export const obtenerRubroPorId = async (req, res, next) => {
  try {
    const rubro = await RubroService.obtenerPorId(req.id)
    res.json(rubro)
  } catch (error) { next(error) }
}

export const crearRubro = async (req, res, next) => {
  try {
    const nuevoRubro = await RubroService.crear(req.body)
    res.status(201).json(nuevoRubro)
  } catch (error) { next(error) }
}

export const actualizarRubro = async (req, res, next) => {
  try {
    const rubroActualizado = await RubroService.actualizar(req.id, req.body)
    res.json(rubroActualizado)
  } catch (error) { next(error) }
}

export const eliminarRubro = async (req, res, next) => {
  try {
    await RubroService.eliminar(req.id)
    res.json({ message: 'Rubro eliminado correctamente' })
  } catch (error) { next(error) }
}