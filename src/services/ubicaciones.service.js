import fs from 'fs';
import path from 'path';

// Leemos el archivo JSON de forma sincrónica al levantar el servidor
const ubicacionesPath = path.resolve('src/data/ubicaciones.json');
const ubicacionesData = JSON.parse(fs.readFileSync(ubicacionesPath, 'utf-8'));

export const obtenerProvinciasService = () => {
    // Extraemos el campo provincia.nombre de cada registro para obtener un listado único[cite: 1].
    const provincias = ubicacionesData.localidades.map(loc => loc.provincia.nombre);
    
    // Usamos Set para eliminar duplicados y devolvemos un array ordenado
    return [...new Set(provincias)].sort();
};

export const obtenerLocalidadesPorProvinciaService = (provinciaNombre) => {
    // Filtramos las localidades que pertenecen a la provincia recibida y devolvemos su campo nombre[cite: 1].
    const localidades = ubicacionesData.localidades
        .filter(loc => loc.provincia.nombre.toLowerCase() === provinciaNombre.toLowerCase())
        .map(loc => loc.nombre);
        
    return [...new Set(localidades)].sort();
};