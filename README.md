# GameBoxd - Plataforma de Reviews de Videojuegos

## Tema General del Proyecto

GameBoxd es una aplicación web full-stack que permite a los usuarios explorar, agregar y reseñar videojuegos. La plataforma ofrece funcionalidades similares a Letterboxd pero enfocada en el mundo de los videojuegos, donde los usuarios pueden:

- Explorar un catálogo de videojuegos
- Agregar nuevos juegos a la base de datos y editar sus atributos
- Escribir y leer reseñas de juegos
- Gestionar listas personales (jugados, favoritos, wishlist)
- Filtrar juegos por año, género, plataforma, rating y tipo de ordenación
- Autenticarse y mantener perfiles de usuario

## Estructura del Estado Global

### Librería utilizada: Redux Toolkit

El proyecto utiliza **Redux Toolkit** como solución de manejo de estado global, implementado con TypeScript.

### Stores/Reducers Implementados:

#### 1. **gameReducer.ts**

- Gestiona el estado de los videojuegos
- Acciones para cargar, agregar, actualizar y guardar los juegos filtrados y el seleccionado
- Maneja el estado de carga y errores relacionados con los juegos

#### 2. **userReducer.ts**

- Controla la informacion del usuario autenticado
- Gestiona juegos jugados, favoritos y en wishlist del usuario
- Maneja el estado de autenticación (login/logout)

#### 3. **reviewReducer.ts**

- Administra las reseñas de los videojuegos
- Acciones para crear reviews
- Vincula reviews con usuarios y juegos específicos

#### 4. **filterReducer.ts**

- Controla los filtros aplicados a la lista de juegos
- Maneja filtros por año, género, plataforma, rating y tipo de ordenación
- Permite combinación múltiple de filtros

## Mapa de Rutas y Flujo de Autenticación

### Estructura de Rutas
``` md
/ (Root.tsx)
├── / - Página principal con lista de juegos filtrable
├── /register - Registro de nuevos usuarios
├── /game/:id - Detalles específicos de un juego
├── /add-game - Formulario para agregar nuevos juegos (requiere auth)
├── /set-game/:id - Edición de juegos existentes (requiere auth + ownership)
└── /profile/:field - Perfil del usuario con la lista de elementos field. Pueden ser juegos jugados (played), en favoritos (favorites), en la wishlist (wishlist) o reviews del usuario (reviews). Requiere auth
```
## Flujo de Autenticación

#### Estados de Autenticación:

- **No autenticado**: Acceso limitado de juegos y registro
- **Autenticado**: Acceso completo a todas las funcionalidades

#### Proceso de Autenticación:

1. **Login/register**: El usuario se autentica vía formularios en Header.tsx
2. **Token Management**: Se utiliza `axiosSecure.ts` para interceptar requests con JWT
3. **Persistencia**: El estado de autenticación se restaura automáticamente al recargar
4. **Protección de Rutas**: Componentes verifican estado de usuario antes de renderizar contenido sensible

#### Funcionalidades por Nivel de Acceso:

**Usuario No Autenticado:**

- Ver lista de juegos con filtros
- Ver detalles de juegos individuales
- Leer reseñas existentes
- Registrarse o Iniciar sesión

**Usuario Autenticado:**

- Todas las funcionalidades anteriores
- Agregar nuevos videojuegos
- Escribir y editar reseñas propias
- Gestionar favoritos y wishlist
- Editar juegos que haya agregado
- Acceder a perfil personalizado

## Descripción tests E2E

Se crearon todos los test necesarios para confirmar el correcto comportamiento de la aplicación. 

En particular se testea la correcta creación y login de usuario. Que solo un usuario loggeado pueda subir nuevos juegos, que pueda agregar juegos a su lista de juegos jugados, favoritos y wishlist. Además de quitarlos de estas.
### PROBLEMA CONOCIDO
#### Issue con Variable de entorno en Testing
Problema identificado: Durante la ejecución de los tests unitarios, la variable process.env.NODE_ENV no se establece correctamente como "test", manteniéndose como "development" incluso cuando se ejecutan los tests.

Impacto: 
- Los tests no utilizan la base de datos de testing separada como estaba diseñado
- La aplicación no puede distinguir automáticamente entre entornos de desarrollo y testing
- Riesgo de conflicto entre datos de desarrollo y datos de prueba


## Librería de Estilos y Decisiones de Diseño

### Librería de Estilos Utilizada: Material-UI (MUI)

El proyecto utiliza **Material-UI v5** como librería principal de componentes y estilos, combinada con css personalizado para elementos específicos.

#### Componentes MUI Implementados:

- **TestField**: Formularios de login, registro y creación de juegos
- **Button & ButtonGroup**: Navegación y acciones del usuario
- **Autocomplete**: Selección de géneros y años en filtros
- **Box**: Layout y contenedores flexibles
- **Icons** (Favorite, Create, Bookmark): Iconografía consistente
- **Fade & Slide**: Animación para errores
- **Rating**: Calificación en una review o de un juego
- **Chip**: Contenedor para los géneros

### Decisiones de Diseño

#### 1. **Esquema de Colores**

- **Tema oscuro predominante**
- **Acentos en blanco**
- **Colores de acción**:
  - Rojo para favoritos
  - Azul/negro para botones principales
  - Chips blancos con texto negro para mejor legibilidad

#### 2. **Tipografía y Espaciado**

- **Fuente del sistema**: Utiliza la fuente por defecto del navegador
- **Espaciado consistente**: Gaps de 20px entre elementos, márgenes de 5px para secciones
- **Responsive spacing**: Padding y margins adaptables a diferentes tamaños de pantalla

#### 3. **Layout y Navegación**

- **Header fijo**
- **Flexbox layout**
- **Grid responsive**
- **Centrado automático**

#### 4. **Formularios y Inputs**

- **Validación visual:** Mensajes de error en rojo, estados de carga con botones deshabilitados
- **UX mejorada**: Autocomplete con chips visuales para selección múltiple

#### 5. **Estados Interactivos**

- **Loading states:**: Botones muestran "Cargando..." durante operaciones async
- **Hover effects**
- **Visual feedback**

#### 6. Consistencia Visual

- **Componentes reutilizables**
- **Paleta limitada**
- **Iconografía coherente**
- **Espaciado sistemático**

## URL aplicación

**URL:** fullstack.dcc.uchile.cl:7113

## Despliegue en Producción

### Comandos de Deploy en server:

```bash
# Compilar el frontend
cd frontend && npm run build:ui
# Compilar el backend
cd ../backend && npm run build
# Subir la carpeta build, public y los archivos package-lock.json, package.json que se ubican en backend, a alguna carpeta del servidor
# OJO, Hay que modificar el package.json en el server, con el script start, a este:
"scripts": {
  "start": "node build/index.js",
...
...
}
# .env
# Hacer un .env en la carpeta que elegimos con los siguientes valores:
MONGODB_URI= // El nombre de la db y su contraseña
MONGODB_DBNAME=fullstack
PORT=7113
HOST=0.0.0.0
# Ejecutar en la raíz de la carpeta :
npm install
npm start
# Luego acceder a la siguiente página (En modo incógnito para que no haya error)
fullstack.dcc.uchile.cl:7113
```

### Comandos de Deploy en Local
```bash
# Backend: crear .env en backend/
MONGODB_URI=mongodb://127.0.0.1:27017/proyecto
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/proyecto_test
PORT=7113
HOST=localhost
NODE_ENV=development

# Frontend
cd frontend
npm install
npm run dev     # levanta en localhost:7158

# Backend
cd ../backend
npm install
npm start  



```
