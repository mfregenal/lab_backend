import * as sectorService from "../services/sector.service.js";

export const obtenerSectores = async (req, res, next) => {
  try {
    const sectores = await sectorService.consultarSectores(req.query);
    return res.json(sectores);
  } catch (error) {
    next(error);
  }
};

export const obtenerSectorPorId = async (req, res, next) => {
  try {
    const sector = await sectorService.obtenerSectorPorId(req.params.id);
    return res.json(sector);
  } catch (error) {
    next(error);
  }
};

export const crearSector = async (req, res, next) => {
  try {
    const nuevoSector = await sectorService.crearSector(req.body);
    return res.status(201).json(nuevoSector);
  } catch (error) {
    next(error);
  }
};

export const actualizarSector = async (req, res, next) => {
  try {
    const sectorActualizado = await sectorService.actualizarSector(
      req.params.id,
      req.body
    );
    return res.json(sectorActualizado);
  } catch (error) {
    next(error);
  }
};

export const eliminarSector = async (req, res, next) => {
  try {
    await sectorService.eliminarSector(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};