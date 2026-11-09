import { z } from "zod";
import {
  crearUsuarioSchema,
  crearAdministradorSchema,
  actualizarUsuarioSchema,
  actualizarEstadoUsuarioSchema,
  iniciarSesionSchema
} from "../validators/usuario.schema.js";
import { crearRubroSchema, actualizarRubroSchema } from "../validators/rubro.schema.js";

// 1.2: las entradas se derivan de los validadores Zod con z.toJSONSchema (target "openapi-3.0", io "input").
// Convierte un esquema Zod de entrada al formato OpenAPI 3.0 y le agrega un ejemplo.
const desdeZod = (esquema, example) => ({
  ...z.toJSONSchema(esquema, { target: "openapi-3.0", io: "input" }),
  example
});

/* Cuerpos de solicitud (derivados de los validadores Zod) */

export const NuevoUsuario = desdeZod(crearUsuarioSchema.omit({ rol: true }), {
  nombre: "Ana",
  apellido: "Pérez",
  email: "ana@example.com",
  contrasena: "Clave12345",
  postulacion: {
    dni: "30123456",
    celular: "3834123456",
    nom_emprend: "Telares del Valle",
    desc_emprend: "Ponchos y mantas tejidos a mano",
    trayectoria: "10 años de oficio",
    rubroId: 1,
    provincia: "Catamarca",
    localidad: "HUAYCAMA"
  }
});

export const NuevoAdministrador = desdeZod(crearAdministradorSchema.omit({ rol: true }), {
  nombre: "Luis",
  apellido: "Gómez",
  email: "luis@example.com",
  contrasena: "Clave12345"
});

export const ActualizacionUsuario = desdeZod(actualizarUsuarioSchema, {
  nombre: "Ana María"
});

export const EstadoUsuario = desdeZod(actualizarEstadoUsuarioSchema, {
  std_usuario: false
});

export const InicioSesion = desdeZod(iniciarSesionSchema, {
  email: "ana@example.com",
  contrasena: "Clave12345"
});

export const NuevoRubro = desdeZod(crearRubroSchema, {
  nom_rubro: "Textiles",
  desc_rubro: "Tejidos y prendas artesanales"
});

export const ActualizacionRubro = desdeZod(actualizarRubroSchema, {
  desc_rubro: "Tejidos, ponchos y mantas"
});

/* Parámetros reutilizables de ruta y de consulta */

export const IdRuta = { type: "integer", minimum: 1 };
export const Pagina = { type: "integer", minimum: 1, default: 1 };
export const Limite = { type: "integer", minimum: 1, maximum: 100, default: 10 };
export const Direccion = { type: "string", enum: ["asc", "desc"], default: "desc" };
export const OrdenRubros = { type: "string", enum: ["createdAt", "nom_rubro", "id_rubro"], default: "id_rubro" };
export const OrdenUsuarios = { type: "string", enum: ["createdAt", "nombre", "apellido"], default: "createdAt" };
export const OrdenConsultas = { type: "string", enum: ["createAt", "metodo", "endpoint", "id_consulta"], default: "id_consulta" };

/* 1.2 y 1.5: esquema de respuesta ErrorApi (properties/required), referenciado desde un error de cada operación */

export const ErrorApi = {
  type: "object",
  required: ["mensaje"],
  properties: {
    mensaje: { type: "string", description: "Causa del error." },
    detalles: {
      description: "Errores de validación por campo. Es un objeto vacío cuando el error no es de validación.",
      oneOf: [
        {
          type: "array",
          items: {
            type: "object",
            required: ["campo", "mensaje"],
            properties: {
              campo: { type: "string" },
              mensaje: { type: "string" }
            }
          }
        },
        { type: "object" }
      ]
    }
  }
};