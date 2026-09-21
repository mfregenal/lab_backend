import prisma from "../config/prisma.js";

export const crearPabellon = async (datosPabellon) => {
  const { nom_pabellon, desc_pabellon } = datosPabellon;

  // Regla de negocio con consulta a la base de datos
  const existePabellon = await prisma.pabellon.findFirst({
    where: {
      nom_pabellon: {
        equals: nom_pabellon,
        mode: "insensitive", // Ignora mayúsculas y minúsculas
      },
    },
  });

  if (existePabellon) {
    const error = new Error("Ya existe un pabellón registrado con ese nombre.");
    error.status = 400;
    throw error;
  }

  return prisma.pabellon.create({
    data: {
      nom_pabellon,
      desc_pabellon: desc_pabellon ?? null,
    },
  });
};