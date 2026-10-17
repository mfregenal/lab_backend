import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';


export const crearPostulacionService = async (dataDTO) => {
    const rubroExiste = await prisma.rubro.findUnique({
        where: { id_rubro: dataDTO.rubroId }
    });


    if (!rubroExiste) {
        throw crearError(`El rubro con ID ${dataDTO.rubroId} no existe.`, 404);
    }


    try {
        return await prisma.postulacion.create({ data: dataDTO });
    } catch (error) {
        if (error.code === 'P2002') {
            throw crearError('Ya existe otra postulación registrada con ese DNI', 409);
        }
        throw error;
    }
};


export const obtenerPostulacionesService = async (filtrosDTO) => {
    const { estado, nombre, dni, provincia, pagina, limite} = filtrosDTO;
   
    const condiciones = {};


    if (estado) {
        condiciones.std_postulacion = estado;
    }
    if (nombre) {
        condiciones.nom_emprend = { contains: nombre, mode: 'insensitive' };
    }
    if (dni) {
        condiciones.dni = { contains: dni };
    }
    if (provincia) {
        condiciones.provincia = { contains: provincia, mode: 'insensitive' };
    }


    const totalRegistros = await prisma.postulacion.count({
        where: condiciones
    });




    const skip = (pagina - 1) * limite;


    const postulaciones = await prisma.postulacion.findMany({
        where: condiciones,
        skip: skip,
        take: limite,
        include: {
            usuario: { select: { nombre: true, apellido: true, email: true } },
            rubro: { select: { nom_rubro: true } },
            admin: { select: { nombre: true, apellido: true } }
        }
    });


    return {
        data: postulaciones,
        meta: {
            total: totalRegistros,
            page: pagina,
            limit: limite,
            totalPages: Math.ceil(totalRegistros / limite)
        }
    };
};




export const obtenerPostulacionIdService = async (id) => {
    const postulacion = await prisma.postulacion.findUnique({
        where: { id_postulacion: id },
        include: {
            usuario: { select: { nombre: true, apellido: true, email: true } },
            rubro: true
        }
    });


    if (!postulacion) {
        throw crearError(`No existe una postulación con id ${id}`, 404);
    }


    return postulacion;
};


export const actualizarPostulacionService = async (id, dataDTO) => {
    try {
        const postulacionActualizada = await prisma.postulacion.update({
            where: { id_postulacion: id },
            data: dataDTO
        });
        return postulacionActualizada;
    } catch (error) {
        if (error.code === 'P2025') {
            throw crearError(`No existe una postulación con id ${id}`, 404);
        }
        if (error.code === 'P2002') {
            throw crearError('Ya existe otra postulación registrada con ese DNI', 400);
        }
        throw error;
    }
};


export const eliminarPostulacionService = async (id) => {
    try {
        await prisma.postulacion.delete({
            where: { id_postulacion: id }
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw crearError(`No existe una postulación con id ${id}`, 404);
        }
        throw error;
    }
};
