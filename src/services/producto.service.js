import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';


export const obtenerProductosService = async (filtrosDTO) => {
    const { nombre, rubro, stand } = filtrosDTO;

    const condiciones = {
        std_producto: "Stock" 
    };

    if (nombre) {
        condiciones.nom_producto = { contains: nombre, mode: 'insensitive' };
    }

    if (rubro || stand) {
        condiciones.artesano = {};
        
        if (rubro) {
            condiciones.artesano.rubro = {
                nom_rubro: { contains: rubro, mode: 'insensitive' }
            };
        }
        if (stand) {
            condiciones.artesano.stand = {
                codigo: { contains: stand, mode: 'insensitive' }
            };
        }
    }

    const productos = await prisma.producto.findMany({
        where: condiciones,
        include: {
            artesano: {
                include: {
                    postulacion: { select: { nom_emprend: true } },
                    rubro: { select: { nom_rubro: true } },
                    stand: { select: { codigo: true } }
                }
            }
        }
    });

    return productos;
};


export const crearProductoService = async (dataDTO) => {
    
    const artesanoExiste = await prisma.artesano.findUnique({
        where: { id_artesano: dataDTO.artesanoID }
    });

    if (!artesanoExiste) {
        throw crearError(`El artesano con ID ${dataDTO.artesanoID} no existe.`, 404);
    }

    const nuevoProducto = await prisma.producto.create({
        data: dataDTO
    });

    return nuevoProducto;
};