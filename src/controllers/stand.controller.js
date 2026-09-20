import * as standService from "../services/stands.service.js";

export const obtenerStands = async (req, res, next) => {
  try {
    const resultado = await standService.consultarStands(req.consultaStands);
    return res.json(resultado);
  } catch (error) {
    next(error);
  }
};

export const obtenerStandPorId = async (req, res, next) => {
  try {
    const stand = await standService.obtenerStandPorId(req.params.id);
    return res.json(stand);
  } catch (error) {
    next(error);
  }
};

export const crearStand = async (req, res, next) => {
  try {
    const nuevoStand = await standService.crearStand(req.body);
    return res.status(201).json(nuevoStand);
  } catch (error) {
    next(error);
  }
};

export const actualizarStand = async (req, res, next) => {
  try {
    const standActualizado = await standService.actualizarStand(req.params.id, req.body);
    return res.json(standActualizado);
  } catch (error) {
    next(error);
  }
};

export const eliminarStand = async (req, res, next) => {
  try {
    await standService.eliminarStand(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};