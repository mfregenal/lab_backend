# API Gestión del Poncho

Bienvenido/a al repositorio de la **API Gestión del Poncho**! 
---

##  Integrantes del Equipo

| Apellido y Nombre | MUN° |
| :--- | :--- |
| **Fregenal, Marcelo Nahuel** | `00428` |
| **Diaz, Marcos German** | `00412` |
| **Alvarez Parma, Alan Uriel** | `00079` |

---

##  Requisitos Previos

Para poder ejecutar este proyecto, asegúrate de tener instalado:
- **Node.js** (Versión **24 LTS**)

---

##  Instalación y Ejecución

Sigue estos pasos para configurar y levantar el entorno de desarrollo local:

1. **Instalar las dependencias del proyecto:**
   ```bash
   npm install
   ```

2. **Ejecutar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```

---

##  Documentación de Endpoints

A continuación se detallan las rutas disponibles para interactuar con la API, divididas por sus recursos principales.

###  Artesanos

| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /artesanos | Lista todos los artesanos registrados. |
| GET | /artesanos/:id | Devuelve los detalles de un artesano específico según su ID. |
| POST | /artesanos | Añade un nuevo artesano al sistema. |
| DELETE| /artesanos/:id | Elimina un artesano existente mediante su ID. |

###  Productos

| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /productos | Lista todos los productos del catálogo. |
| GET | /productos/:id | Devuelve los detalles de un producto específico según su ID. |
| GET | /productos/filtrado?nombre={nombre} | Filtra y devuelve la lista de productos que coincidan con el nombre. |
| POST | /productos | Añade un nuevo producto al sistema. |
| DELETE| /productos/:id | Elimina un producto existente mediante su ID. |

---
