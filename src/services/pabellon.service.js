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
    throw crearError(`Ya existe un pabellón registrado con el nombre: ${nom_pabellon}.`,409);
    
  }

  return prisma.pabellon.create({
    data: {
      nom_pabellon,
      desc_pabellon: desc_pabellon ?? null,
    },
  });
};