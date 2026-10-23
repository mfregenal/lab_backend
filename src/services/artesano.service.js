import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const obtenerArtesanosService = async (filtrosDTO) => {
    const { nombre, apellido, rubro, provincia, localidad, stand, pagina, limite, ordenPor, direccion } = filtrosDTO;

    const condiciones = {};

    if (nombre || apellido) {
        condiciones.usuario = {};
        if (nombre) condiciones.usuario.nombre = { contains: nombre, mode: 'insensitive' };
        if (apellido) condiciones.usuario.apellido = { contains: apellido, mode: 'insensitive' };
    }

    if (rubro || provincia || localidad) {
        condiciones.postulacion = {};
        
        if (rubro) {
            condiciones.postulacion.rubro = { nom_rubro: { contains: rubro, mode: 'insensitive' } };
        }
        if (provincia) {
            condiciones.postulacion.provincia = { contains: provincia, mode: 'insensitive' };
        }
        if (localidad) {
            condiciones.postulacion.localidad = { contains: localidad, mode: 'insensitive' };
        }
    }

    if (stand) {
        condiciones.stand = { codigo: { contains: stand, mode: 'insensitive' } };
    }

    const totalRegistros = await prisma.artesano.count({ where: condiciones });
    const skip = (pagina - 1) * limite;

    const artesanos = await prisma.artesano.findMany({
        where: condiciones,
        skip: skip,
        take: limite,
        include: {
            usuario: { select: { nombre: true, apellido: true, email: true } },
            postulacion: { 
                select: { nom_emprend: true, localidad: true, provincia: true, rubro: true }
            },
            stand: { select: { codigo: true } }
        }
    });

    return {
        data: artesanos,
        meta: {
            total: totalRegistros,
            page: pagina,
            limit: limite,
            totalPages: Math.ceil(totalRegistros / limite)
        }
    };
};

export const obtenerArtesanoIdService = async (id, usuario) => {
    const artesano = await prisma.artesano.findUnique({
        where: { id_artesano: id },
        include: {
            usuario: { select: { nombre: true, apellido: true, email: true } },
            postulacion: { include: { rubro: true } },
            stand: true
        }
    });

    if (!artesano) {
        throw crearError(`No existe un artesano con id ${id}`, 404);
    }
    if (usuario.rol === 'ARTESANO' && artesano.usuarioId !== usuario.id) {
        throw crearError(`No existe un artesano con id ${id}`, 404);
    }
    return artesano;
};

export const asignarStandService = async (id, standId) => {
    try {
        return await prisma.$transaction(async (tx) => {
            const artesano = await tx.artesano.findUnique({ where: { id_artesano: id } });
            if (!artesano) throw crearError(`No existe un artesano con id ${id}`, 404);

            const stand = await tx.stand.findUnique({ where: { id_stand: standId }, include: { artesano: true } });
            if (!stand) throw crearError(`No existe un stand con id ${standId}`, 404);

            const yaAsignadoAlArtesano = stand.std_stand === 'OCUPADO' && stand.artesano?.id_artesano === id;
            if (stand.std_stand !== 'DISPONIBLE' && !yaAsignadoAlArtesano) {
                throw crearError('El stand no está disponible', 409);
            }

            if (artesano.standId && artesano.standId !== standId) {
                await tx.stand.update({ where: { id_stand: artesano.standId }, data: { std_stand: 'DISPONIBLE' } });
            }

            await tx.stand.update({ where: { id_stand: standId }, data: { std_stand: 'OCUPADO' } });

            return tx.artesano.update({
                where: { id_artesano: id },
                data: { standId },
                include: { stand: { include: { sector: { include: { pabellon: true } } } } }
            });
        }, { isolationLevel: 'Serializable' });
    } catch (error) {
        if (error.code === 'P2034') {
            throw crearError('El stand o el artesano fue modificado por otra operación. Intente nuevamente.', 409);
        }
        throw error;
    }
};

export const actualizarArtesanoService = async (id, dataDTO, usuario) => {
    try {
        const { nom_emprend, trayectoria, localidad, standId } = dataDTO;

        if (standId !== undefined) {
            throw crearError('La asignación de stands debe realizarse mediante el endpoint de asignación.', 400);
        }

        if (usuario.rol === 'ARTESANO') {
            const artesano = await prisma.artesano.findUnique({
                where: { id_artesano: id },
                select: { usuarioId: true }
            });

            if (!artesano || artesano.usuarioId !== usuario.id) {
                throw crearError(`No existe un artesano con id ${id}`, 404);
            }
        }

        const artesanoActualizado = await prisma.artesano.update({
            where: { id_artesano: id },
            data: {
                postulacion: {
                    update: { nom_emprend, trayectoria, localidad }
                }
            },
            include: {
                postulacion: { include: { rubro: true } },
                stand: true
            }
        });

        return artesanoActualizado;
    } catch (error) {
        if (error.status || error.statusCode) throw error
        if (error.code === 'P2025') {
            throw crearError(`No existe un artesano con id ${id}`, 404);
        }
        throw error;
    }
};

export const eliminarArtesanoService = async (id) => {
    try {
        await prisma.artesano.delete({ where: { id_artesano: id } });
    } catch (error) {
        if (error.code === 'P2025') {
            throw crearError(`No existe un artesano con id ${id}`, 404);
        }
        throw error;
    }
};