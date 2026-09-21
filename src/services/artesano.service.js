import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';


export const obtenerArtesanosService = async (filtrosDTO) => {
    const { rubro, producto, stand } = filtrosDTO;

    const condiciones = {};

    if (rubro) {
        condiciones.rubro = {
            nom_rubro: { contains: rubro, mode: 'insensitive' }
        };
    }
    if (stand) {
        condiciones.stand = {
            codigo: { contains: stand, mode: 'insensitive' }
        };
    }
    if (producto) {
        condiciones.productos = {
            some: {
                nom_producto: { contains: producto, mode: 'insensitive' }
            }
        };
    }

    const artesanos = await prisma.artesano.findMany({
        where: condiciones,
        include: {
            postulacion: {
                select: { nom_emprend: true, localidad: true, provincia: true }
            },
            rubro: {
                select: { nom_rubro: true }
            },
            usuario: {
                select: { nombre: true, apellido: true }
            },
            stand: {
                select: { codigo: true } 
            }
        }
    });

    return artesanos;
};


export const crearArtesanoService = async (dataDTO) => {

    const usuarioExiste = await prisma.usuario.findUnique({
        where: { id_usuario: dataDTO.usuarioID }
    });
    if (!usuarioExiste) {
        throw crearError(`El usuario con ID ${dataDTO.usuarioID} no existe.`, 404);
    }

    const postulacionExiste = await prisma.postulacion.findUnique({
        where: { id_postulacion: dataDTO.postulacionID }
    });
    if (!postulacionExiste) {
        throw crearError(`La postulación con ID ${dataDTO.postulacionID} no existe.`, 404);
    }

    const nuevoArtesano = await prisma.artesano.create({
        data: dataDTO
    });

    return nuevoArtesano;
};