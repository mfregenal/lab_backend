import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const crearStand = async (datosStand) => {
    const { codigo, coordenada, id_sector, id_artesano } = datosStand;

    const sectorExiste = await prisma.sector.findUnique({
        where: { id_sector },
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
        throw crearError(`Ya existe un stand registrado con el código: ${codigo}.`, 400);
    }

    return prisma.stand.create({
        data: {
            codigo,
            coordenada,
            id_sector,
            id_artesano: id_artesano ?? null,
        },
        include: {
            sector: true,
            artesano: true,
        },
    });
};

export const consultarStand = async (criteriosConsulta) => {
    const { std_stand, id_sector, ordenPor, direccion, pagina, limite } = criteriosConsulta;

    const where = {};
    if (std_stand) {
        where.estado = { contains: std_stand, mode: "insensitive" };
    }
    if (id_sector) {
        where.id_sector = id_sector;
    }

    const desplazamiento = (pagina - 1) * limite;

    const [stands, total] = await prisma.$transaction([
        prisma.stand.findMany({
            where,
            orderBy: [
                { [ordenPor]: direccion },
                { id_stand: "asc" }, 
            ],
            skip: desplazamiento,
            take: limite,
            include: {
                sector: true,
                artesano: true,
            },
        }),
        prisma.stand.count({ where }),
    ]);

    return {
        stands,
        paginacion: {
            pagina,
            limite,
            total,
            totalPaginas: Math.ceil(total / limite),
        },
    };
};

export const obtenerStandPorId = async (id) => {
  const stand = await prisma.stand.findUnique({
    where: { id_stand: Number(id) },
    include: { sector: true, artesano: true },
  });
  if (!stand) {
    throw crearError(`Stand con ID ${id} no encontrado.`, 404);
  }
  return stand;
};

export const actualizarStand = async (id, datos) => {
  await obtenerStandPorId(id);
  return prisma.stand.update({
    where: { id_stand: Number(id) },
    data: datos,
    include: { sector: true, artesano: true },
  });
};

export const eliminarStand = async (id) => {
  await obtenerStandPorId(id);
  return prisma.stand.delete({
    where: { id_stand: Number(id) },
  });
};