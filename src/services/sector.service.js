import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const crearSector = async (datosSector) => {
  const { nom_sector, pabellonId, id_pabellon } = datosSector;
  const idPabellonNum = Number(pabellonId ?? id_pabellon);

  if (isNaN(idPabellonNum) || idPabellonNum <= 0) {
    throw crearError("El ID del pabellón debe ser un número entero válido.", 400);
  }

  const pabellonExiste = await prisma.pabellon.findUnique({
    where: { id_pabellon: idPabellonNum },
  });

  if (!pabellonExiste) {
    throw crearError(`El pabellón con ID ${idPabellonNum} no existe.`, 404);
  }

  const nombreExiste = await prisma.sector.findFirst({
    where: {
      nom_sector: { equals: nom_sector, mode: "insensitive" },
      pabellonId: idPabellonNum,
    },
  });

  if (nombreExiste) {
    throw crearError(
      `Ya existe un sector "${nom_sector}" registrado en este pabellón.`,
      409
    );
  }

  return prisma.sector.create({
    data: {
      nom_sector,
      pabellonId: idPabellonNum,
    },
    include: {
      pabellon: true,
    },
  });
};

export const consultarSectores = async (filtros = {}) => {
  const { pabellonId, id_pabellon, nom_sector } = filtros;
  const where = {};

  const idPabellonFiltro = pabellonId ?? id_pabellon;
  if (idPabellonFiltro) {
    where.pabellonId = Number(idPabellonFiltro);
  }

  if (nom_sector && nom_sector.trim() !== "") {
    where.nom_sector = {
      contains: nom_sector.trim(),
      mode: "insensitive",
    };
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

  const idPabellonInput = datos.pabellonId ?? datos.id_pabellon;
  const idPabellonFinal =
    idPabellonInput !== undefined ? Number(idPabellonInput) : sectorActual.pabellonId;

  if (idPabellonInput && idPabellonFinal !== sectorActual.pabellonId) {
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
    (idPabellonInput && idPabellonFinal !== sectorActual.pabellonId)
  ) {
    const nombreEnUso = await prisma.sector.findFirst({
      where: {
        nom_sector: { equals: nuevoNombre, mode: "insensitive" },
        pabellonId: idPabellonFinal,
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

  const datosActualizacion = {};
  if (datos.nom_sector !== undefined) {
    datosActualizacion.nom_sector = datos.nom_sector;
  }
  if (idPabellonInput !== undefined) {
    datosActualizacion.pabellonId = idPabellonFinal;
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