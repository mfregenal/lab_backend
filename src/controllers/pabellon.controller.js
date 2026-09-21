import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const obtenerPabellones = async (req, res, next) => {
    try {
        const pabellones = await prisma.pabellon.findMany({
            include: { sectores: true },
        });
        return res.json(pabellones);
    } catch (error) {
        next(error);
    }
};

export const obtenerPabellonPorId = async (req, res, next) => {
    try {
        const pabellon = await prisma.pabellon.findUnique({
            where: { id_pabellon: req.id },
            include: { sectores: true }
        });

        if (!pabellon) {
            return next(crearError(`Pabellón no encontrado con id: ${req.id}`, 404));
        }

        return res.json(pabellon);
    } catch (error) {
        next(error);
    }
};


export const crearPabellon = async (req, res, next) => {
    try {
        const { nom_pabellon, desc_pabellon } = req.body;

        if (!nom_pabellon || typeof nom_pabellon !== 'string') {
            return next(crearError('El campo nom_pabellon es obligatorio y debe ser texto', 400));
        }
        const nuevoPabellon = await prisma.pabellon.create({
            data: {
                nom_pabellon, desc_pabellon: desc_pabellon || null
            }
        });
        return res.status(201).json(nuevoPabellon);
    } catch (error) {
        next(error);
    }
};

export const actualizarPabellon = async (req, res, next) => {
    try {
        const existe = await prisma.pabellon.findUnique({
            where: { id_pabellon: req.id }
        });

        if (!existe) {
            return next(crearError(`No existe el pabellón con id ${req.id}`, 404));
        }

        const { nom_pabellon, desc_pabellon } = req.body;

        const pabellonActualizado = await prisma.pabellon.update({
            where: { id_pabellon: req.id },
            data: {
                nom_pabellon, desc_pabellon:desc_pabellon || null
            }
        });

        return res.json(pabellonActualizado);
    } catch (error) {
        next(error);
    }
};

export const eliminarPabellon = async (req, res, next) => {
    try {
        const existe = await prisma.pabellon.findUnique({
            where: { id_pabellon: req.id }
        });

        if (!existe) {
            return next(crearError(`No existe un pabellón con id ${req.id}`, 404));
        }

        await prisma.pabellon.delete({
            where: { id_pabellon: req.id }
        });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};