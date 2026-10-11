import prisma from "../config/prisma.js"
import { crearError } from "../utils/errores.js";

export const crearSector = async (datosSector) => {
    const { nom_sector, id_pabellon } = datosSector;
    const idPabellonNum = Number(id_pabellon);

    const pabellonExiste = await prisma.pabellon.findUnique({
        where: { id_pabellon: idPabellonNum },
    });

    if (!pabellonExiste) {
        throw crearError(`El pabellón con ID ${idPabellonNum} no existe.`, 404);
    }

    const nombreExiste = await prisma.sector.findFirst({
        where: {
            nom_sector: { equals: nom_sector, mode: "insensitive" },
            id_pabellon: idPabellonNum,
        },
    });

    if (nombreExiste) {
        throw crearError(
            `Ya existe un sector "${nom_sector}" registrado en este pabellón.`,409);
    }

    return prisma.sector.create({
        data: {
            nom_sector,
            id_pabellon: idPabellonNum,
        },
        include: {
            pabellon: true,
        },
    });
};

// 2. Consultar / Listar Sectores (filtro opcional por id_pabellon en query)
export const consultarSectores = async (filtros = {}) => {
    const { id_pabellon } = filtros;
    const where = {};

    if (id_pabellon) {
        where.id_pabellon = Number(id_pabellon);
    }

    return prisma.sector.findMany({
        where,
        include: {
            pabellon: true,
            stands: true,
        },
        orderBy: {
            id_sector: "asc",
        },
    });
};


export const obtenerSectorPorId = async (id) => {
    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
        throw crearError("El ID del sector debe ser un número entero válido.", 400);
    }

    const sector = await prisma.sector.findUnique({
        where: { id_sector: idNum },
        include: {
            pabellon: true,
            stands: true,
        },
    });

    if (!sector) {
        throw crearError(`Sector con ID ${idNum} no encontrado.`, 404);
    }

    return sector;
};


export const actualizarSector = async (id, datos) => {
    const idNum = Number(id);
    const sectorActual = await obtenerSectorPorId(idNum);

    const idPabellonFinal =
        datos.id_pabellon !== undefined? Number(datos.id_pabellon): sectorActual.id_pabellon;

    if (datos.id_pabellon && datos.id_pabellon !== sectorActual.id_pabellon) {
        const pabellonExiste = await prisma.pabellon.findUnique({
            where: { id_pabellon: idPabellonFinal },
        });
        if (!pabellonExiste) {
            throw crearError(`El pabellón con ID ${idPabellonFinal} no existe.`, 404);
        }
    }

    const nuevoNombre = datos.nom_sector ?? sectorActual.nom_sector;
    if (
        datos.nom_sector ||
        (datos.id_pabellon && datos.id_pabellon !== sectorActual.id_pabellon)
    ) {
        const nombreEnUso = await prisma.sector.findFirst({
            where: {
                nom_sector: { equals: nuevoNombre, mode: "insensitive" },
                id_pabellon: idPabellonFinal,
                NOT: { id_sector: idNum },
            },
        });

        if (nombreEnUso) {
            throw crearError(
                `Ya existe un sector con el nombre "${nuevoNombre}" en ese pabellón.`,
                409
            );
        }
    }

    const datosActualizacion = { ...datos };
    if (datosActualizacion.id_pabellon !== undefined) {
        datosActualizacion.id_pabellon = idPabellonFinal;
    }

    return prisma.sector.update({
        where: { id_sector: idNum },
        data: datosActualizacion,
        include: {
            pabellon: true,
            stands: true,
        },
    });
};

export const eliminarSector = async (id) => {
    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
        throw crearError("El ID del sector debe ser un número entero válido.", 400);
    }

    try {
        return await prisma.sector.delete({
            where: { id_sector: idNum },
        });
    } catch (error) {
        if (error.code === "P2025") {
            throw crearError(`Sector con ID ${idNum} no encontrado.`, 404);
        }
        throw error;
    }
};