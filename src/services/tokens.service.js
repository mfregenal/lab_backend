import jwt from "jsonwebtoken";
import { secretoJWT } from "../config/jwt.js";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export const generarToken = (usuario) => {
    return jwt.sign(
        { 
            sub: String(usuario.id_usuario), 
            jti: randomUUID() 
        },
        secretoJWT,
        { 
            algorithm: "HS256", 
            expiresIn: "15m"
        }
    );
};

export const verificarToken = (token) => {

    const payload = jwt.verify(token, secretoJWT, {
        algorithms: ["HS256"]
    });

  
    if (
        typeof payload !== "object" ||
        payload === null ||
        !z.coerce.number().safeParse(payload.sub).success ||
        typeof payload.jti !== "string" ||
        !payload.jti.trim() ||
        !Number.isFinite(payload.exp)
    ) {
        throw new jwt.JsonWebTokenError("Contenido del token inválido.");
    }

    return { 
        id: Number(payload.sub), 
        jti: payload.jti, 
        exp: payload.exp 
    };
};