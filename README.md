# GameBoxd

## Descripción del Proyecto

GameBoxd nace como una idea de tener una biblioteca de juegos, ya sea videojuegos (principalmente), juegos de mesa, de azar, etc. donde poder calificarlos, hacer comentarios y compartirlo con nuestros amigos. Esta idea nace ya que queremos compartir nuestras experiencias con los juegos, con nuestros amigos, para así tener una base de datos de los mejores juegos que hemos probado.

## Variables de entorno requeridas
Antes de inicar la aplicación, en un archivo .env almacenado en el backend anotar las siguientes variables de entorno:

```
# --- Servidor ---
PORT=3001
HOST=localhost
NODE_ENV=development

# --- JWT Secret
JWT_SECRET = process.env.JWT_SECRET || "my_secret"

# --- Base de datos principal (para cuando corres el servidor normalmente) ---
MONGODB_URI=mongodb://127.0.0.1:27017/lab6

# --- Base de datos de testing (usada automáticamente cuando NODE_ENV=test) ---
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/lab6_test
```


## Instalación y ejecución del proyecto

Desde la raiz del proyecto hacer los siguientes pasos en dos terminales: uno para el backend y el otro para el frontend.

### Backend real (TypeScript + Express + Mongoose)

```
cd backend
npm install
npm start
```

### Frontend (React)

```
cd frontend
npm install
npm run dev
```

### Uso

1. Asegurate de que ambos servidores estén ejecutándose
2. Abrir en el navegador `http://localhost:5173`
3. Finalmente, queda disfrutar la app
