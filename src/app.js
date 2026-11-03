import express from 'express';
import { readFileSync } from 'node:fs';
import swaggerUi from 'swagger-ui-express';

import './config/jwt.js';
import { iniciarLimpiezaRevocaciones } from './tareas/limpiezaRevocaciones.js';

// Importación de rutas
import artesanoRoutes from './routes/artesano.routes.js';
import productosRoutes from './routes/producto.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import rubroRoutes from './routes/rubro.routes.js';
import postulacionRoutes from './routes/postulacion.routes.js';
import pabellonRoutes from './routes/pabellon.routes.js';
import sectorRoutes from './routes/sector.routes.js';
import swaggerAutogen from "swagger-autogen";
import { fileURLToPath } from "node:url";
import * as esquemas_cur from "./src/documentacion/esquemas.js";
import * as esquemas_pap from "./src/documentacion/esquemas-pap.js";
import * as esquemas_upps from "./src/documentacion/esquemas-upss.js";

const doc = {
  info: {
    title: "API de Gestión del Poncho",
    version: "1.0.0",
    description: "Documentación de la API del Poncho."
  },
  servers: [{ url: "/", description: "Servidor local" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    "@schemas": { ...esquemas_cur, ...esquemas_pap }
  }
};

const ruta = (archivo) =>
  fileURLToPath(new URL(archivo, import.meta.url)).replaceAll("\\", "/");

const outputFile = ruta("./swagger-output.json");
const routes = [ruta("./src/app.js")];
const generar = swaggerAutogen({ openapi: "3.0.0" });

const resultado = await generar(outputFile, routes, doc);
if (!resultado.success) {
  throw new Error("No se pudo generar la especificación OpenAPI.");
}
