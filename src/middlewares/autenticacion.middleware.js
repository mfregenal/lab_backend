import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { verificarToken } from "../services/tokens.service.js";
import { tokenEstaRevocado } from "../services/revocaciones.service.js";

export const autenticarUsuario = async (req, res, next) => {
  const encabezado = req.get("Authorization");


  if (!encabezado) {
    res.set("WWW-Authenticate", "Bearer");
    return res.status(401).json({ mensaje: "Se requiere un token de acceso." });
  }

  // Validamos el formato del encabezado Authorization para asegurarnos de que sea un token Bearer válido
  const coincidencia = /^Bearer\s+(\S+)$/i.exec(encabezado);
  if (!coincidencia) {
    res.set("WWW-Authenticate", 'Bearer error="invalid_request"');
    return res.status(400).json({ mensaje: "Usar Authorization: Bearer <token>." });
  }

  try {
    const token = verificarToken(coincidencia[1]);

    if (await tokenEstaRevocado(token.jti)) {
      throw new jwt.JsonWebTokenError("Token revocado.");
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: token.id },
      select: { rol: true, std_usuario: true }
    });

    // Validamos si el usuario existe y si está activo
    if (!usuario) {
      res.set("WWW-Authenticate", '******"invalid_token"');
      return res.status(401).json({ mensaje: "La cuenta asociada al token no existe." });
    }

    if (usuario.std_usuario !== true) {
      return res.status(403).json({ mensaje: "La cuenta está inactiva." });
    }

    // Agregar la información del usuario al objeto req para que esté disponible en los controladores
    req.usuario = { ...token, rol: usuario.rol };

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.set("WWW-Authenticate", 'Bearer error="invalid_token"');
      return res.status(401).json({ mensaje: "El token es inválido, ha vencido o fue revocado." });
    }
    return next(error);
  }
};


export const autenticarUsuarioOpcional = (req, res, next) => {
  if (!req.get('Authorization')) return next();
  return autenticarUsuario(req, res, next);
};