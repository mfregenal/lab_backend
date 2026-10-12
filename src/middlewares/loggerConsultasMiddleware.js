import { guardarConsulta } from '../services/consulta.service.js'

export const loggerConsultas = (req, res, next) => {
  res.on('finish', async () => {
    try {
      const endpoint = req.originalUrl
      const metodo = req.method

      const query = Object.keys(req.query).length > 0 ? req.query : null
      const params = Object.keys(req.params).length > 0 ? req.params : null

      await guardarConsulta({ metodo, endpoint, query, params })
    } catch (error) {
      console.error('Error guardando consulta:', error)
    }
  })

  next()
}