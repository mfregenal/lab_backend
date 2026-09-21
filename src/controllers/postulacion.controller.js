import { crearError } from '../utils/errores.js';
import { crearPostulacionService, obtenerPostulacionesService } from '../services/postulacion.service.js';


export const obtenerPostulaciones = async (req, res, next) => {
    try {
  
        const filtrosDTO = req.query;

        const postulaciones = await obtenerPostulacionesService(filtrosDTO);
        
        res.json(postulaciones);
    } catch (error) {
        console.error(error);
        next(crearError('Error al obtener las postulaciones', 500));
    }
};

export const obtenerPostulacionId = async (req, res, next) => {
    try {
        const id = req.id;
        const postulacion = await prisma.postulacion.findUnique({
            where: { id_postulacion: id },
            include: {
                visitante: { select: { nombre: true, apellido: true, email: true } },
                rubro: true
            }
        });

        if (!postulacion) {
            return next(crearError(`No existe una postulación con id ${id}`, 404));
        }

        res.json(postulacion);
    } catch (error) {
        console.error(error);
        next(crearError('Error al buscar la postulación', 500));
    }
};

export const crearPostulacion = async (req, res, next) => {
    try {
        const postulacionDTO = req.body;

        const nuevaPostulacion = await crearPostulacionService(postulacionDTO);

        res.status(201).json(nuevaPostulacion);
    } catch (error) {
        console.error(error);
        
        if (error.statusCode) {
            return next(error);
        }

        next(crearError('Error interno al crear la postulación', 500));
    }
};

export const actualizarPostulacion = async (req, res, next) => {
    try {
        const id = req.id; 
        
        const { dni, celular, pais, provincia, localidad, nom_emprend, desc_emprend, trayectoria } = req.body;

        const postulacionActualizada = await prisma.postulacion.update({
            where: { id_postulacion: id },
            data: {
                dni, 
                celular, 
                pais, 
                provincia, 
                localidad, 
                nom_emprend, 
                desc_emprend, 
                trayectoria
            }
        });

        res.json(postulacionActualizada);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return next(crearError(`No existe una postulación con id ${req.id}`, 404));
        }
        if (error.code === 'P2002') {
            return next(crearError('Ya existe otra postulación registrada con ese DNI', 400));
        }
        next(crearError('Error al actualizar la postulación', 500));
    }
};


export const evaluarPostulacion = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { std_postulacion, observacion, adminId } = req.body;

        if (!std_postulacion || !adminId) {
            return next(crearError('El estado de evaluación y el ID del administrador son obligatorios', 400));
        }

        const resultado = await prisma.$transaction(async (tx) => {
            const postulacionActualizada = await tx.postulacion.update({
                where: { id_postulacion: id },
                data: {
                    std_postulacion, 
                    observacion,
                    adminId: Number(adminId)
                }
            });

            if (std_postulacion === 'APROBADA') {
                const artesanoExistente = await tx.artesano.findUnique({
                    where: { postulacionId: id }
                });

                if (!artesanoExistente) {
                    await tx.artesano.create({
                        data: {
                            usuarioId: postulacionActualizada.visitanteId,
                            postulacionId: postulacionActualizada.id_postulacion,
                            rubroId: postulacionActualizada.rubroId
                        }
                    });
                }
            }

            return postulacionActualizada;
        });

        res.json({ mensaje: 'Postulación evaluada correctamente', postulacion: resultado });
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return next(crearError(`No existe una postulación con id ${req.params.id}`, 404));
        }
        next(crearError('Error al evaluar la postulación', 500));
    }
};

export const eliminarPostulacion = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        await prisma.postulacion.delete({
            where: { id_postulacion: id }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return next(crearError(`No existe una postulación con id ${req.params.id}`, 404));
        }
        next(crearError('Error al eliminar la postulación', 500));
    }
};