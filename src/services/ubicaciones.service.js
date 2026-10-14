import fs from 'fs';
import path from 'path';

// Leemos el archivo JSON 
const ubicacionesPath = path.resolve('src/data/ubicaciones.json');
const ubicacionesData = JSON.parse(fs.readFileSync(ubicacionesPath, 'utf-8'));


export const obtenerProvinciasService = () => {
    const provincias = ubicacionesData.localidades.map(loc => loc.provincia.nombre);
    
    return [...new Set(provincias)].sort();
};

export const obtenerLocalidadesPorProvinciaService = (provinciaNombre) => {

    const localidades = ubicacionesData.localidades
        .filter(loc => loc.provincia.nombre.toLowerCase() === provinciaNombre.toLowerCase())
        .map(loc => loc.nombre);
        
    return [...new Set(localidades)].sort();
};