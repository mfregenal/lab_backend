import * as UsuarioService from '../services/usuario.service.js'

export const obtenerUsuarios = async (req, res, next) => {
  try {
    const resultado = await UsuarioService.obtenerTodos(req.queryValido)
    res.json(resultado)
  } catch (error) { next(error) }
}

export const obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const usuario = await UsuarioService.obtenerPorId(req.id) // req.id viene de validarId
    res.json(usuario)
  } catch (error) { next(error) }
}

export const crearUsuario = async (req, res, next) => {
  try {
    const nuevoUsuario = await UsuarioService.crear(req.body)
    res.status(201).json(nuevoUsuario)
  } catch (error) { next(error) }
}

export const actualizarUsuario = async (req, res, next) => {
  try {
    const usuarioActualizado = await UsuarioService.actualizar(req.id, req.body)
    res.json(usuarioActualizado)
  } catch (error) { next(error) }
}

export const eliminarUsuario = async (req, res, next) => {
  try {
    await UsuarioService.eliminar(req.id)
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) { next(error) }
}