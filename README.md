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

###  Usuario
| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /usuarios | Lista todos los usuarios existentes. |
| GET | /usuarios/:id | Devuelve los detalles de un usuario específico según su ID. |
| GET | /usuarios?filtro={valor_filtro} | Filtra y devuelve la lista de usuarios que coincidan. Se puede combinar y filtrar por nombre, apellido y email. |
| POST | /usuarios | Añade un nuevo usuario al sistema. |
| DELETE| /usuarios/:id | Elimina un usuario existente mediante su ID. |


###  Rubro


| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /rubros | Lista todos los rubros existentes. |
| GET | /rubros/:id | Devuelve los detalles de un rubro específico según su ID. |
| GET | /rubros?filtro={valor_filtro} | Filtra y devuelve la lista de rubros que coincidan. Se puede combinar y filtrar por nombre del rubro y por una parte de la descripción del rubro. |
| POST | /rubros | Añade un nuevo rubro al sistema. |
| DELETE| /rubros/:id | Elimina un rubro existente mediante su ID. |


###  Postulación
| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /postulacion | Lista todos los productos del catálogo. |
| GET | /postulacion/:id | Devuelve los detalles de un producto específico según su ID. |
| GET | /postulacion?filtros={valor_filtro} | Filtra y devuelve la lista de postulaciones que coincidan con el nombre.Se puede combinar y filtrar por nombre, dni y país. |
| POST | /postulacion | Añade un nuevo producto al sistema. |
| PUT | /postulación/:id | Actualiza una postulación del sistema identificado por su ID. |
| DELETE| /postulacion/:id | Elimina un producto existente mediante su ID. |


###  Artesanos


| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /artesanos | Lista todos los artesanos registrados. |
| GET | /artesanos/:id | Devuelve los detalles de un artesano específico según su ID. |
| GET | /artesanos?filtros={valor_filtro} | Filtra y devuelve la lista de artesanos que coincidan. Se puede combinar y filtrar por rubro, producto y stand. |
| POST | /artesanos | Añade un nuevo artesano al sistema. |
| PUT | /artesanos/:id | Actualiza un artesano del sistema identificado por su ID. |
| DELETE| /artesanos/:id | Elimina un artesano existente mediante su ID. |


###  Productos


| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /productos | Lista todos los productos del catálogo. |
| GET | /productos/:id | Devuelve los detalles de un producto específico según su ID. |
| GET | /productos?filtros={valor_filtro} | Filtra y devuelve la lista de productos que coincidan. Se puede combinar y filtrar por rubro, nombre y stand.|
| POST | /productos | Añade un nuevo producto al sistema. |
| PUT | /productos/:id | Actualiza un producto del sistema identificado por su ID. |
| DELETE| /productos/:id | Elimina un producto existente mediante su ID. |




###  Pabellon


| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /pabellones | Lista todos los pabellones del poncho. |
| GET | /pabellones/:id | Devuelve los detalles de un pabellón específico según su ID. |
| POST | /pabellones | Añade un nuevo pabellón al sistema. |
| PUT | /pabellones/:id | Actualiza un pabellón del sistema identificado por su ID. |
| DELETE| /pabellones/:id | Elimina un pabellón existente mediante su ID. |



###  Sector


| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /sectores | Lista todos los sectores del poncho. |
| GET | /sectores/:id | Devuelve los detalles de un sector específico según su ID. |
| GET | /sectores?pabellon={id} | Filtra y devuelve la lista de stands que coincidan. Se puede filtrar por el id del pabellón. |
| POST | /sectores | Añade un nuevo sector al sistema. |
| PUT | /sectores/:id | Actualiza un sector del sistema identificado por su ID. |
| DELETE| /sectores/:id | Elimina un sector existente mediante su ID. |


###  Stand


| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| GET | /stands | Lista todos los stands del poncho. |
| GET | /stands/:id | Devuelve los detalles de un stand específico según su ID. |
| GET | /stands?filtro={valor_filtro} | Filtra y devuelve la lista de stands que coincidan. Se puede combinar y filtrar por artesano, sector y estado. |
| POST | /stands | Añade un nuevo stand al sistema. |
| PUT | /stands/:id | Actualiza un stand del sistema identificado por su ID. |
| DELETE| /stands/:id | Elimina un stand existente mediante su ID. |


---
