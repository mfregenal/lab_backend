import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const crearStand = async (datosStand) => {
    const { codigo, latitud, longitud, id_sector } = datosStand;

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
        throw crearError(`Ya existe un stand registrado con el código: ${codigo}.`, 409);
    }

    return prisma.stand.create({
        data: {
            codigo,
            latitud: latitud ?? null,
            longitud: longitud ?? null,
            id_sector,
            id_artesano: id_artesano ?? null,
        },
        include: {
            sector: true,
        },
    });
};

export const consultarStand = async (criteriosConsulta) => {
    const { std_stand, id_sector, ordenPor, direccion, pagina, limite } = criteriosConsulta;

    const where = {};
    if (std_stand) {
        where.std_stand = { contains: std_stand, mode: "insensitive" };
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
    include: { sector: true },
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

  if (datos.codigo && datos.codigo !== standActual.codigo) {
    const existe = await prisma.stand.findUnique({ 
      where: { codigo: datos.codigo } 
    });
    if (existe) throw crearError('El codigo ya se encuentra en uso', 409);
  }

  return prisma.stand.update({
    where: { id_stand: idNum },
    data: datos,
    include: { sector: true },
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