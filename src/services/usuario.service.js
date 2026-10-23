import prisma from '../config/prisma.js'
import { crearError } from '../utils/errores.js'
import bcrypt from 'bcrypt'

const SELECT_PUBLIC_USER = {
    id_usuario: true, 
    nombre: true, 
    apellido: true, 
    email: true, 
    rol: true, 
    std_usuario: true, 
    createdAt: true, 
    updatedAt: true
}

const FACTOR_COSTO = 10

// Protege frente a modificaciones simultáneas.
const transaccionSerializable = async (operacion) => {
    try {
        return await prisma.$transaction(operacion, { isolationLevel: 'Serializable' })
    } catch (error) {
        if (error.code === 'P2034') {
            throw crearError('La operación entra en conflicto con otro cambio de cuenta. Intente nuevamente.', 409)
        }
        throw error
    }
}

export const obtenerTodos = async (query) => {
  const { pagina, limite, nombre, email, rol, ordenPor, direccion } = query

  const where = {}
  if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' }
  if (email) where.email = { contains: email, mode: 'insensitive' }
  if (rol) where.rol = rol

  const [usuarios, total] = await prisma.$transaction([
    prisma.usuario.findMany({
      where,
      skip: (pagina - 1) * limite,
      take: limite,
      orderBy: [
        { [ordenPor]: direccion },
        { id_usuario: 'desc' } // Desempate por ID
      ],
      select: SELECT_PUBLIC_USER
    }),
    prisma.usuario.count({ where })
  ])


  return {
    data: usuarios,
    meta: {
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite)
    }
  }
}

export const obtenerPorId = async (id) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: id },
        select: SELECT_PUBLIC_USER
    })

    if (!usuario) throw crearError('Usuario no encontrado', 404)

    return usuario
}

export const crear = async (datos, rol = 'ARTESANO') => {
    const { postulacion, contrasena, ...datosUsuario } = datos

    if (rol === 'ADMINISTRADOR' && postulacion) {
        throw crearError('Los administradores no pueden tener una postulación', 400)
    }

    return prisma.$transaction(async (tx) => {
        if (postulacion) {
            const rubroExiste = await tx.rubro.findUnique({
                where: { id_rubro: postulacion.rubroId },
                select: { id_rubro: true }
            })

            if (!rubroExiste) {
                throw crearError(`El rubro con ID ${postulacion.rubroId} no existe`, 404)
            }
        }
        
        const passwordHash = await bcrypt.hash(contrasena, FACTOR_COSTO)
        
        const usuario = await tx.usuario.create({
            data: { ...datosUsuario, passwordHash, rol, std_usuario: true },
            select: SELECT_PUBLIC_USER
        })

        if (!postulacion) return { ...usuario, postulacion: null }

        const postulacionCreada = await tx.postulacion.create({
            data: {
                ...postulacion,
                usuarioId: usuario.id_usuario
            }
        })

        return { ...usuario, postulacion: postulacionCreada }
    })
}

export const actualizar = async (id, datos, actor) => {
    if (actor.rol === 'ARTESANO' && actor.id !== id) {
        throw crearError('No tienes permisos para modificar el perfil de otro usuario', 403)
    }

    return transaccionSerializable(async (tx) => {
        const usuarioActual = await tx.usuario.findUnique({
            where: { id_usuario: id },
            select: { email: true, rol: true, std_usuario: true }
        })
        if (!usuarioActual) throw crearError('Usuario no encontrado', 404)

        if (datos.rol !== undefined && datos.rol !== usuarioActual.rol && actor.rol !== 'ADMINISTRADOR') {
            throw crearError('Solo un administrador puede cambiar el rol de un usuario', 403)
        }

        if (
            usuarioActual.rol === 'ADMINISTRADOR' &&
            usuarioActual.std_usuario &&
            datos.rol === 'ARTESANO'
        ) {
            const otrosAdministradoresActivos = await tx.usuario.count({
                where: {
                    id_usuario: { not: id },
                    rol: 'ADMINISTRADOR',
                    std_usuario: true
                }
            })

            if (otrosAdministradoresActivos === 0) {
                throw crearError('Debe quedar al menos un administrador activo', 409)
            }
        }

        if (datos.email && datos.email !== usuarioActual.email) {
            const existe = await tx.usuario.findUnique({ where: { email: datos.email } })
            if (existe) throw crearError('El email ya se encuentra en uso', 409)
        }

        return tx.usuario.update({
            where: { id_usuario: id },
            data: datos,
            select: SELECT_PUBLIC_USER
        })
    })
}

export const iniciarSesion = async (datos) => {
    const usuario = await prisma.usuario.findUnique({ where: { email: datos.email } })

    if (!usuario) throw crearError('Email o contraseña incorrectos', 401)
    if (usuario.std_usuario !== true) throw crearError('La cuenta está inactiva', 403)

    const contrasenaValida = await bcrypt.compare(datos.contrasena, usuario.passwordHash)

    if (!contrasenaValida) {
        throw crearError('Email o contraseña incorrectos', 401)
    }

    delete usuario.passwordHash 

    return usuario
}

// Función para cambiar el estado de un usuario (activo/inactivo) con control de transacciones y validaciones
export const cambiarEstado = async (id, std_usuario) => {
    return transaccionSerializable(async (tx) => {
        const usuario = await tx.usuario.findUnique({
            where: { id_usuario: id },
            select: { rol: true, std_usuario: true }
        })

        if (!usuario) throw crearError('Usuario no encontrado', 404)

        // Validación para evitar que se desactive al último administrador activo
        if (usuario.rol === 'ADMINISTRADOR' && usuario.std_usuario === true && !std_usuario) {
            const otrosAdministradoresActivos = await tx.usuario.count({
                where: {
                    id_usuario: { not: id },
                    rol: 'ADMINISTRADOR',
                    std_usuario: true
                }
            })

            if (otrosAdministradoresActivos === 0) {
                throw crearError('Debe quedar al menos un administrador activo', 409)
            }
        }

        return tx.usuario.update({
            where: { id_usuario: id },
            data: { std_usuario },
            select: SELECT_PUBLIC_USER
        })
    })
}

export const eliminar = async (id) => {
    return transaccionSerializable(async (tx) => {
        const usuario = await tx.usuario.findUnique({
            where: { id_usuario: id },
            select: { rol: true, std_usuario: true }
        })

        if (!usuario) throw crearError('Usuario no encontrado', 404)

        // Validación para evitar que se elimine al último administrador activo
        if (usuario.rol === 'ADMINISTRADOR' && usuario.std_usuario === true) {
            const otrosAdministradoresActivos = await tx.usuario.count({
                where: {
                    id_usuario: { not: id },
                    rol: 'ADMINISTRADOR',
                    std_usuario: true
                }
            })

            if (otrosAdministradoresActivos === 0) {
                throw crearError('No se puede eliminar al último administrador activo', 409)
            }
        }

        await tx.usuario.delete({ where: { id_usuario: id } })
    })
}