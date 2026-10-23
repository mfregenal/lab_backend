import * as UsuarioService from '../services/usuario.service.js'
import { generarToken } from '../services/tokens.service.js';
import { revocarToken } from '../services/revocaciones.service.js';

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

export const crearAdministrador = async (req, res, next) => {
  try {
    const nuevoUsuario = await UsuarioService.crear(req.body, 'ADMINISTRADOR')
    res.status(201).json(nuevoUsuario)
  } catch (error) { next(error) }
}

export const actualizarUsuario = async (req, res, next) => {
  try {
    const usuarioActualizado = await UsuarioService.actualizar(req.id, req.body, req.usuario)
    res.json(usuarioActualizado)
  } catch (error) { next(error) }
}

export const actualizarEstadoUsuario = async (req, res, next) => {
  try {
    const usuarioActualizado = await UsuarioService.cambiarEstado(req.id, req.body.std_usuario)
    res.json(usuarioActualizado)
  } catch (error) { next(error) }
}

export const eliminarUsuario = async (req, res, next) => {
  try {
    await UsuarioService.eliminar(req.id)
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) { next(error) }
}

export const iniciarSesion = async (req, res, next) => {
  try {
    const usuario = await UsuarioService.iniciarSesion(req.iniciarSesionDTO)

    const token = generarToken(usuario);

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario
    });
  } catch (error) { next(error) }
};

export const obtenerMiPerfil = async (req, res, next) => {
    try {
        const usuario = await UsuarioService.obtenerPorId(req.usuario.id);
        
        res.status(200).json(usuario);
    } catch (error) {
        if (error.statusCode === 404) {
            res.set("WWW-Authenticate", 'Bearer error="invalid_token"');
            return res.status(401).json({ mensaje: "La cuenta asociada al token no existe." });
        }
        next(error);
    }
};

export const cerrarSesion = async (req, res, next) => {
    try {
        await revocarToken(req.usuario);
        return res.status(204).end(); // 204 significa éxito, pero sin cuerpo en la respuesta
    } catch (error) {
        next(error);
    }
};