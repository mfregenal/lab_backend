import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const crearStand = async (datosStand) => {
    const { codigo, latitud, longitud,sectorId, id_sector } = datosStand;
    const sectorIdNum = Number(sectorId ?? id_sector);

    const sectorExiste = await prisma.sector.findUnique({
        where: { id_sector: sectorIdNum },
    });

    if (!sectorExiste) {
        throw crearError(`El sector con ID ${id_sector} no existe.`, 400);
    }

    const codigoExiste = await prisma.stand.findFirst({
        where: {
            codigo: {
                equals: codigo,
                mode: "insensitive",
            },
        },
    });

    if (codigoExiste) {
        throw crearError(`Ya existe un stand registrado con el código: ${codigo}.`, 409);
    }

    return prisma.stand.create({
        data: {
            codigo,
            latitud: latitud ?? null,
            longitud: longitud ?? null,
            sectorId: sectorIdNum,
        },
        include: {
            sector: true,
        },
    });
};

export const consultarStand = async (criteriosConsulta) => {
    const { std_stand, sectorId, id_sector, nom_emprend, rubro, ordenPor = 'id_stand', direccion = 'asc', pagina = 1, limite = 10 } = criteriosConsulta;

    const where = {};
    if (std_stand) {
        where.std_stand = std_stand;
    }

    const sectorFiltro = sectorId ?? id_sector;
    if (sectorFiltro) {
        where.sectorId = Number(sectorFiltro);
    }

    //Filtro del nombre del emprendimiento por parte del artesano
    if (nom_emprend && nom_emprend.trim() !== '') {
        where.artesano = {
            is: {
                postulacion: {
                    nom_emprend: {
                        contains: nom_emprend.trim(),
                        mode: 'insensitive',
                    },
                },
            },
        };
    }

    //Filtro del rubro
    if (rubro && rubro.trim() !== '') {
        where.artesano = {
            ...(where.artesano ?? {}),
            is: {
                ...(where.artesano?.is ?? {}),
                postulacion: {
                    ...(where.artesano?.is?.postulacion ?? {}),
                    rubro: {
                        nom_rubro: {
                            contains: rubro.trim(),
                            mode: 'insensitive',
                        },
                    },
                },
            },
        };
    }

    const paginaNum = Math.max(1, Number(pagina));
    const limiteNum = Math.max(1, Number(limite));
    const desplazamiento = (paginaNum - 1) * limiteNum;

    const [stands, total] = await prisma.$transaction([
        prisma.stand.findMany({
            where,
            orderBy: [
                { [ordenPor]: direccion },
                { id_stand: "asc" },
            ],
            skip: desplazamiento,
            take: limiteNum,
            include: {
                sector: {
                    include: {
                        pabellon: true,
                    },
                },
                artesano: {
                    include: {
                        usuario: {
                            select: {
                                id_usuario: true,
                                nombre: true,
                                apellido: true,
                                email: true,
                            },
                        },
                        postulacion: {
                            select: {
                                id_postulacion: true,
                                nom_emprend: true,
                                rubro: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.stand.count({ where }),
    ]);

    return {
        stands,
        paginacion: {
            pagina: paginaNum,
            limite: limiteNum,
            total,
            totalPaginas: Math.ceil(total / limiteNum),
        },
    };
};

export const obtenerStandPorId = async (id) => {
    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
        throw crearError('El ID del stand debe ser un número entero válido.', 400);
    }
    const stand = await prisma.stand.findUnique({
        where: { id_stand: idNum },
        include: {
            sector: {
                include: {
                    pabellon: true,
                },
            },
            artesano: {
                include: {
                    postulacion: {
                        include: {
                            rubro: true,
                        },
                    },
                },
            },
        },
    });
    if (!stand) {
        throw crearError(`Stand con ID ${id} no encontrado.`, 404);
    }
    return stand;
};

export const actualizarStand = async (id, datos) => {
    const idNum = Number(id);

    const standActual = await prisma.stand.findUnique({
        where: { id_stand: idNum }
    });
    if (!standActual) throw crearError('Stand no encontrado', 404);

    if (datos.codigo && datos.codigo.toLowerCase() !== standActual.codigo.toLowerCase()) {
        const existe = await prisma.stand.findUnique({
            where: {
                codigo: { equals: datos.codigo, mode: 'insensitive' },
                NOT: { id_stand: idNum },
            },
        });
        if (existe) throw crearError('El codigo ya se encuentra en uso', 409);
    }

    // Si actualizan el sector padre, verificar que exista
    const nuevoSectorId = datos.sectorId ?? datos.id_sector;
    if (nuevoSectorId && Number(nuevoSectorId) !== standActual.sectorId) {
        const sectorExiste = await prisma.sector.findUnique({
            where: { id_sector: Number(nuevoSectorId) },
        });
        if (!sectorExiste) {
            throw crearError(`El sector con ID ${nuevoSectorId} no existe.`, 404);
        }
    }

    const datosAActualizar = { ...datos };
    if (nuevoSectorId !== undefined) {
        datosAActualizar.sectorId = Number(nuevoSectorId);
        delete datosAActualizar.id_sector;
    }
    if (datosAActualizar.latitud !== undefined) {
        datosAActualizar.latitud = datosAActualizar.latitud ? Number(datosAActualizar.latitud) : null;
    }
    if (datosAActualizar.longitud !== undefined) {
        datosAActualizar.longitud = datosAActualizar.longitud ? Number(datosAActualizar.longitud) : null;
    }

    return prisma.stand.update({
        where: { id_stand: idNum },
        data: datosAActualizar,
        include: {
            sector: true,
        },
    });
};



export const eliminarStand = async (id) => {
    try {
        return await prisma.stand.delete({
            where: { id_stand: Number(id) },
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw crearError('Stand no encontrado.', 404);
        }
        throw error;
    }
};