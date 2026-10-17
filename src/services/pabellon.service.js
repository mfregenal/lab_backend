import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const crearPabellon = async (datosPabellon) => {
  const { nom_pabellon, desc_pabellon } = datosPabellon;

  const existePabellon = await prisma.pabellon.findFirst({
    where: {
      nom_pabellon: {
        equals: nom_pabellon,
        mode: "insensitive",
      },
    },
  });

  if (existePabellon) {
    throw crearError(`Ya existe un pabellón registrado con el nombre: ${nom_pabellon}.`, 409);

  }

  return prisma.pabellon.create({
    data: {
      nom_pabellon,
      desc_pabellon: desc_pabellon ?? null,
    },
  });
};

export const consultarPabellones = async (filtros = {}) => {
  const { nom_pabellon } = filtros;
  const where = {};

  if (nom_pabellon && nom_pabellon.trim() !== '') {
    where.nom_pabellon = {
      contains: nom_pabellon.trim(),
      mode: 'insensitive',
    };
  }

  return prisma.pabellon.findMany({
    where,
    include: {
      sectores: true,
    },
    orderBy: {
      id_pabellon: 'asc',
    },
  });
};

export const obtenerPabellonId = async (id) => {
  const idNum = Number(id);
  if (isNaN(idNum) || idNum <= 0) {
    throw crearError('El ID del pabellón debe ser un número entero válido.', 400);
  }

  const pabellon = await prisma.pabellon.findUnique({
    where: { id_pabellon: idNum },
    include: {
      sectores: true,
    },
  });

  if (!pabellon) {
    throw crearError(`Pabellón con ID ${idNum} no encontrado.`, 404);
  }

  return pabellon;
};

export const actualizarPabellon = async (id, datos) => {
  const idNum = Number(id);
  
  const pabellonActual = await obtenerPabellonId(idNum);

  if (datos.nom_pabellon && datos.nom_pabellon.toLowerCase() !== pabellonActual.nom_pabellon.toLowerCase()) {
    const nombreEnUso = await prisma.pabellon.findFirst({
      where: {
        nom_pabellon: { equals: datos.nom_pabellon, mode: 'insensitive' },
        NOT: { id_pabellon: idNum },
      },
    });

    if (nombreEnUso) {
      throw crearError(`El nombre "${datos.nom_pabellon}" ya está registrado en otro pabellón.`, 409);
    }
  }

  return prisma.pabellon.update({
    where: { id_pabellon: idNum },
    data: datos,
    include: {
      sectores: true,
    },
  });
};

export const eliminarPabellon = async (id) => {
  const idNum = Number(id);
  if (isNaN(idNum) || idNum <= 0) {
    throw crearError('El ID del pabellón debe ser un número entero válido.', 400);
  }

  try {
    return await prisma.pabellon.delete({
      where: { id_pabellon: idNum },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw crearError(`Pabellón con ID ${idNum} no encontrado.`, 404);
    }
    throw error;
  }
};