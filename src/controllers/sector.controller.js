import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const obtenerSectores = async (req, res, next) => {
    try {
        const sectores = await prisma.sector.findMany({
            include: { pabellon: true, stands: true },
        });
        return res.json(sectores);
    } catch (error) {
        next(error);
    }
};

export const obtenerSectorPorId = async (req, res, next) => {
    try {
        const sector = await prisma.sector.findUnique({
            where: { id_sector: req.id },
            include: { pabellon: true, stands: true },
        });

        if (!sector) {
            return next(crearError(`Sector no encontrado con id: ${req.id}`, 404));
        }

        return res.json(sector);
    } catch (error) {
        next(error);
    }
};


export const crearSector = async (req, res, next) => {
    try {
        const { nom_sector, id_pabellon } = req.body;

        if (!nom_sector || !id_pabellon) {
            return next(crearError('El campo nom_sector e id_pabellon son obligatorios', 400));
        }

        const existePabellon = await prisma.pabellon.findUnique({
            where: { id_pabellon: Number(id_pabellon) },
        });

        if (!existePabellon) {
            return next(crearError('El pabellón asociado no existe', 404));
        }

        const nuevoSector = await prisma.sector.create({
            data: {
                nom_sector, id_pabellon: Number(id_pabellon),
            },
        });
        return res.status(201).json(nuevoSector);
    } catch (error) {
        next(error);
    }
};

export const actualizarSector = async (req, res, next) => {
    try {
        const existe = await prisma.sector.findUnique({
            where: { id_sector: req.id }
        });

        if (!existe) {
            return next(crearError(`No existe el sector con id ${req.id}`, 404));
        }


        const { nom_sector, id_pabellon } = req.body;

        if (id_pabellon) {
            const existePabellon = await prisma.pabellon.findUnique({
                where: { id_pabellon: Number(id_pabellon) },
            });
            if (!existePabellon) {
                return next(crearError('El pabellón asociado no existe', 404));
            }
        }
        
        const sectorActualizado = await prisma.sector.update({
            where: { id_sector: req.id },
            data: {
                nom_sector, id_pabellon: id_pabellon ? Number(id_pabellon) : undefined,
            },
        });

        return res.json(sectorActualizado);
    } catch (error) {
        next(error);
    }
};

export const eliminarSector = async (req, res, next) => {
    try {
        const existe = await prisma.sector.findUnique({
            where: { id_sector: req.id }
        });

        if (!existe) {
            return next(crearError(`No existe un sector con id ${req.id}`, 404));
        }

        await prisma.sector.delete({
            where: { id_sector: req.id }
        });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};