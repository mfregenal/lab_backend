import { crearError } from '../utils/errores.js';
import * as pabellonService from '../services/pabellon.service.js';

export const obtenerPabellones = async (req, res, next) => {
  try {
    const resultado = await pabellonService.consultarPabellones();
    return res.json(resultado);
  } catch (error) {
    next(error);
  }
};

export const obtenerPabellonPorId = async (req, res, next) => {
  try {
    const pabellon = await pabellonService.obtenerPabellonId(req.params.id);
    return res.json(pabellon);
  } catch (error) {
    next(error);
  }
};


export const crearPabellon = async (req, res, next) => {
  try {
    const nuevoPabellon = await pabellonService.crearPabellon(req.body);
    return res.status(201).json(nuevoPabellon);
  } catch (error) {
    next(error);
  }
};

export const actualizarPabellon = async (req, res, next) => {
  try {
    const pabellonActualizado = await pabellonService.actualizarPabellon(req.params.id, req.body);
    return res.json(pabellonActualizado);
  } catch (error) {
    next(error);
  }
};

export const eliminarPabellon = async (req, res, next) => {
  try {
    await pabellonService.eliminarPabellon(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};