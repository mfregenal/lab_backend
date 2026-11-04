import swaggerAutogen from "swagger-autogen";
import { fileURLToPath } from "node:url";
import * as esquemas_cur from "./src/documentacion/esquemas-cur.js";
import * as esquemas_pap from "./src/documentacion/esquemas-pap.js";

// 1.1: este archivo se ejecuta con "npm run docs" (script en package.json), lee las rutas de src/app.js y genera swagger-output.json.
const doc = {
  info: {
    title: "API de Gestión del Poncho",
    version: "1.0.0",
    description: "Documentación de la API del Poncho."
  },
  servers: [{ url: "/", description: "Servidor local" }],
  components: {
    securitySchemes: {
      // 1.3: esquema de seguridad Bearer (JWT); las operaciones protegidas lo declaran con #swagger.security en cada archivo de rutas.
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    // 1.2: los esquemas exportados por los archivos de documentación se registran en "@schemas" y quedan disponibles para los $ref.
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