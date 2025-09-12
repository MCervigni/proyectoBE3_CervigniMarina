# Proyecto Backend 3 - Sistema de Adopción de Mascotas

Aplicación backend para gestión de adopciones de mascotas desarrollada con Node.js, Express y MongoDB.

## 🚀 Características

- **Gestión de Usuarios**: CRUD completo para usuarios
- **Gestión de Mascotas**: CRUD completo para mascotas  
- **Sistema de Adopciones**: Proceso completo de adopción
- **Sistema de Mocking**: Generación de datos ficticios para testing
- **Autenticación**: Sistema de sessions y cookies
- **Base de Datos**: MongoDB con Mongoose
- **Arquitectura por Capas**: Router → Controller → Service → Repository → DAO

## 🐳 Docker

### Imagen en Docker Hub
```bash
docker pull mcervigni/img-entregafinal-adoptme:1.0.0
```

**Link a Docker Hub**: [mcervigni/img-entregafinal-adoptme](https://hub.docker.com/r/mcervigni/img-entregafinal-adoptme)

### Ejecutar con Docker
```bash
# Ejecutar la imagen desde Docker Hub
docker run -p 8080:8080 mcervigni/img-entregafinal-adoptme:1.0.0

# O construir localmente
docker build -t adoptme-app .
docker run -p 8080:8080 adoptme-app
```

## 📡 API Endpoints

### 👥 Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:uid` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PUT /api/users/:uid` - Actualizar usuario
- `DELETE /api/users/:uid` - Eliminar usuario

### 🐕 Mascotas
- `GET /api/pets` - Obtener todas las mascotas
- `GET /api/pets/:pid` - Obtener mascota por ID
- `POST /api/pets` - Crear mascota
- `PUT /api/pets/:pid` - Actualizar mascota
- `DELETE /api/pets/:pid` - Eliminar mascota

### 🏠 Adopciones
- `GET /api/adoptions` - Obtener todas las adopciones
- `GET /api/adoptions/:aid` - Obtener adopción por ID
- `POST /api/adoptions` - Crear adopción
- `PUT /api/adoptions/:aid` - Actualizar adopción
- `DELETE /api/adoptions/:aid` - Eliminar adopción

### 🎭 Mocking (Datos Ficticios)
- `GET /api/mocks/mockingpets` - Generar mascotas ficticias
- `GET /api/mocks/mockingusers` - Generar usuarios ficticios
- `POST /api/mocks/generateData` - Insertar datos ficticios en la BD

### 🔐 Sesiones
- `POST /api/sessions/register` - Registrar usuario
- `POST /api/sessions/login` - Iniciar sesión
- `POST /api/sessions/logout` - Cerrar sesión
- `GET /api/sessions/current` - Usuario actual

## 🏗️ Arquitectura del Proyecto

```
src/
├── controllers/     # Controladores (manejo de HTTP)
├── dao/            # Data Access Objects (acceso a BD)
├── dto/            # Data Transfer Objects
├── repository/     # Repositorios (lógica de negocio)
├── routes/         # Definición de rutas
├── services/       # Servicios (orquestación)
├── utils/          # Utilidades y helpers
├── config/         # Configuración
└── app.js          # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: bcrypt, cookie-parser
- **Testing**: Faker.js para datos ficticios
- **Contenización**: Docker
- **Variables de Entorno**: dotenv
