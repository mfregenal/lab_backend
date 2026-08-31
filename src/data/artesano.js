export const artesanos = [
    {id: 1, nombre: "Juan", provincia: "Buenos Aires", localidad: "La Plata", rubro: "Carpintería"},
    {id: 2, nombre: "María", provincia: "Córdoba", localidad: "Córdoba", rubro: "Alfarería"},
    {id: 3, nombre: "Carlos", provincia: "Santa Fe", localidad: "Rosario", rubro: "Pintura"},
]

export const siguienteId = () => artesanos.length > 0 ? Math.max(...artesanos.map(artesano => artesano.id)) + 1 : 1;