import { guardarConsulta } from '../services/consulta.service.js'

export const loggerConsultas = (req, res, next) => {
  res.on('finish', async () => {
    try {
      const endpoint = req.originalUrl
      const metodo = req.method
      const query = JSON.stringify({ ...req.query } || {})
      const params = JSON.stringify({ ...req.params } || {})

      await guardarConsulta({ metodo, endpoint, query, params })
    } catch (error) {
      console.error('Error guardando consulta:', error)
    }
  })

  next()
}