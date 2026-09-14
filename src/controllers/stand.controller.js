import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const obtenerStands = async (req, res, next) => {
    try {
        const stands = await prisma.stand.findMany({
            include: { sector:{include:{pabellon:true},},},
        });
        return res.json(stands);
    } catch (error) {
        next(error);
    }
};

export const obtenerStandPorId = async (req, res, next) => {
    try {
        const stand = await prisma.stand.findUnique({
            where: { id_stand: req.id },
            include: { sector:{include:{pabellon:true},},},
        });

        if (!stand) {
            return next(crearError(`Stand no encontrado con id: ${req.id}`, 404));
        }

        return res.json(stand);
    } catch (error) {
        next(error);
    }
};


export const crearStand = async (req, res, next) => {
    try {
        const { codigo, coordenada, std_stand, id_sector } = req.body;

        if (!codigo || !coordenada || !id_sector) {
            return next(crearError('Los campos codigo, coordenada e id_sector son obligatorios', 400));
        }

        const existeSector = await prisma.sector.findUnique({
            where: { id_sector: Number(id_sector) },
        });

        if (!existeSector) {
            return next(crearError('El sector asignado no existe', 404));
        }

        const nuevoStand = await prisma.stand.create({
            data: {
                codigo, coordenada, std_stand: std_stand || 'En preparación',
                id_sector: Number(id_sector),
            },
        });
        return res.status(201).json(nuevoStand);
    } catch (error) {
        next(error);
    }
};

export const actualizarStand = async (req, res, next) => {
    try {
        const existe = await prisma.stand.findUnique({
            where: { id_stand: req.id }
        });

        if (!existe) {
            return next(crearError(`No existe el stand con id ${req.id}`, 404));
        }


        const { codigo, coordenada, std_stand, id_sector } = req.body;

        if (id_sector) {
            const existeSector = await prisma.sector.findUnique({
                where: { id_sector: Number(id_sector) },
            });
            if (!existeSector) {
                return next(crearError('El sector asociado no existe', 404));
            }
        }
        
        const standActualizado = await prisma.stand.update({
            where: { id_stand: req.id },
            data: {
                codigo, coordenada, std_stand,
                id_sector: id_sector ? Number(id_sector) : undefined,
            },
        });

        return res.json(standActualizado);
    } catch (error) {
        if (error.code === 'P2002') {
        return next(crearError(`Ya existe un stand con ese código`, 409));
    }
        next(error);
    }
};

export const eliminarStand = async (req, res, next) => {
    try {
        const existe = await prisma.stand.findUnique({
            where: { id_stand: req.id }
        });

        if (!existe) {
            return next(crearError(`No existe un stand con id ${req.id}`, 404));
        }

        await prisma.stand.delete({
            where: { id_stand: req.id }
        });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};