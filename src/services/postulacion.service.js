import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const crearPostulacionService = async (dataDTO) => {

    const rubroExiste = await prisma.rubro.findUnique({
        where: { id_rubro: dataDTO.rubroId }
    });

    if (!rubroExiste) {
    
        throw crearError(`El rubro (categoría) con ID ${dataDTO.rubroId} no existe.`, 404);
    }


    const nuevaPostulacion = await prisma.postulacion.create({
        data: dataDTO 
    });

    return nuevaPostulacion;
};

export const obtenerPostulacionesService = async (filtrosDTO) => {

    const { estado, nombre, dni, pais } = filtrosDTO;
    
    const condiciones = {};

    if (estado) {
        condiciones.std_postulacion = estado.toUpperCase();
    }
    if (nombre) {
        condiciones.nom_emprend = { contains: nombre, mode: 'insensitive' };
    }
    if (dni) {
        condiciones.dni = { contains: dni };
    }
    if (pais) {
        condiciones.pais = { contains: pais, mode: 'insensitive' };
    }


    const postulaciones = await prisma.postulacion.findMany({
        where: condiciones,
        include: {
            visitante: { select: { nombre: true, apellido: true, email: true } },
            rubro: { select: { nom_rubro: true } },
            admin: { select: { nombre: true, apellido: true } } 
        }
    });

    return postulaciones;
};