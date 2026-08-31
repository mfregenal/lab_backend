import { crearError } from '../utils/errores.js';

let productos=[
  { id: 1, nombre: "Poncho Catamarqueño de Vicuña", precio: 150000 },
  { id: 2, nombre: "Cuenco de Cerámica Rustica", precio: 12500 },
  { id: 3, nombre: "Cinturón de Cuero Crudo", precio: 18000 },
  { id: 4, nombre: "Mate Imperial con Virola de Acero", precio: 30000}
];

export const siguienteId = () => productos.length > 0 ? Math.max(...productos.map(producto => producto.id)) + 1 : 1;

// GET de productos
export const obtenerProductos = (req,res) => {
    return res.status(200).json(productos)
};

export const obtenerProductosFiltrados = (req,res) =>{
    const {nombre} = req.query;
    
    if (!nombre) {
    return res.status(200).json(productos)};
  
    const productosFiltrados = productos.filter((producto)=> producto.nombre.toLowerCase().includes(nombre.toLowerCase().trim())
  );
 

    res.status(200).json(productosFiltrados);
};

export const obtenerProductosporId = (req,res,next) => {
     const id = parseInt(req.params.id);

    const producto = productos.find(
        p => p.id === id
    );

    if (!producto) {
        const error = new Error("El producto no existe.");
        error.status = 404;

        return next(error);
    }

    res.json(producto);
}

// POST de productos

export const crearProducto = (req,res,next)=>{
     if (!req.body.nombre || !req.body.precio) {
        const error = new Error(
            "Los campos 'nombre' y 'precio' son obligatorios."
        );

        error.status = 400;

        return next(error);
    }

    const nuevoProducto = {
        id: siguienteId(),
        nombre: req.body.nombre,
        precio: req.body.precio
    };

    productos.push(nuevoProducto);

    res.status(201).json(nuevoProducto);
};

// DELETE de productos
export const eliminarProducto = (req, res, next) => {
    const id = Number(req.params.id);
    
    const indice = productos.findIndex(producto => producto.id === id);

    if (indice === -1) {
        const error= new Error(`no existe un producto con id ${id}`);
        error.status=404;
        return next(error);
    }

    productos.splice(indice, 1);
    res.status(204).send();
};