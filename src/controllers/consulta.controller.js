import * as ConsultaService from '../services/consulta.service.js'

export const obtenerConsultas = async (req, res, next) => {
  try {
    // Usamos el queryValido procesado por Zod
    const resultado = await ConsultaService.obtenerTodos(req.queryValido)
    res.json(resultado)
  } catch (error) {
    next(error)
  }
}