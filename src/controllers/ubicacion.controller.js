import { crearError } from '../utils/errores.js';
import { 
    obtenerProvinciasService, 
    obtenerLocalidadesPorProvinciaService 
} from '../services/ubicaciones.service.js';

export const obtenerProvincias = async (req, res, next) => {
    try {
        // Almacenamos el array de provincias obtenido del servicio
        const provincias = obtenerProvinciasService();
        
        res.json(provincias);
    } catch (error) {
        console.error(error);
        next(crearError('Error al cargar las provincias', 500));
    }
};

export const obtenerLocalidades = async (req, res, next) => {
    try {
        // Extraemos el nombre de la provincia de la URL (ej: /localidades/Catamarca)
        const { provincia } = req.params;

        const localidades = obtenerLocalidadesPorProvinciaService(provincia);

        if (localidades.length === 0) {
            return next(crearError(`No se encontraron localidades para la provincia: ${provincia}`, 404));
        }

        res.json(localidades);
    } catch (error) {
        console.error(error);
        next(crearError('Error al cargar las localidades', 500));
    }
};