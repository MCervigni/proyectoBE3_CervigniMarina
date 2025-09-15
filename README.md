# Proyecto Backend 3 - Sistema de Adopción de Mascotas

Aplicación backend para gestión de adopciones de mascotas desarrollada con Node.js, Express y MongoDB.

## 🚀 Características

- **Gestión de Usuarios**: CRUD completo para usuarios
- **Gestión de Mascotas**: CRUD completo para mascotas  
- **Sistema de Adopciones**: Proceso completo de adopción
- **Sistema de Mocking**: Generación de datos ficticios para testing
- **Autenticación**: Sistema de sessions y cookies
- **Base de Datos**: MongoDB con Mongoose
- **Tests Automatizados**: Suite de tests con Mocha y Chai
- **Documentación API**: Swagger para endpoints de Users y Pets
- **Arquitectura por Capas**: Router → Controller → Service → Repository → DAO

## 🐳 Docker

### Imagen en Docker Hub
```bash
docker pull mcervigni/img-entregafinal-adoptme:1.0.0
```

**Link a Docker Hub**: [mcervigni/img-entregafinal-adoptme](https://hub.docker.com/r/mcervigni/img-entregafinal-adoptme)


### Variables de Entorno
```env
PORT=8080
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/
DB_NAME=adoptme
```

## 🧪 Testing

### Suite de Tests Automatizados
El proyecto incluye tests automatizados para la ruta **Pets** cubriendo los métodos principales:

```bash
# Ejecutar tests
npm test

# Resultados esperados:
✔ 11 tests passing
✔ GET /api/pets - Obtener todas las mascotas
✔ POST /api/pets - Crear nueva mascota
✔ PUT /api/pets/:pid - Actualizar mascota existente
```

### Cobertura de Tests
- ✅ **GET operations** - Obtener mascotas y validar estructura
- ✅ **POST operations** - Crear mascotas con validaciones
- ✅ **PUT operations** - Actualizar mascotas existentes
- ✅ **Validaciones** - Campos requeridos (name, specie, birthDate)
- ✅ **Error handling** - Casos de datos incompletos o inválidos
- ✅ **Data integrity** - Verificación de tipos de datos

### Tecnologías de Testing
- **Mocha**: Framework de testing
- **Chai**: Librería de aserciones
- **Supertest**: Testing de APIs HTTP

## 📖 Documentación API - Swagger

### Acceso a Documentación
```bash
# Iniciar servidor y acceder a:
http://localhost:8080/api-docs
```

### Endpoints Documentados
La documentación Swagger incluye:

#### 👥 **Users** (Usuarios)
- Esquemas de datos completos
- Ejemplos de requests y responses
- Códigos de estado HTTP
- Validaciones requeridas

#### 🐕 **Pets** (Mascotas)
- Modelos de datos detallados
- Operaciones CRUD documentadas
- Parámetros de entrada
- Respuestas esperadas

### Características de la Documentación
- ✅ **Interfaz interactiva** para probar endpoints
- ✅ **Esquemas JSON** definidos
- ✅ **Ejemplos de uso** para cada endpoint
- ✅ **Validaciones** y tipos de datos especificados

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
├── test/           # Tests automatizados
├── utils/          # Utilidades y helpers
├── config/         # Configuración
└── app.js          # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: bcrypt, cookie-parser
- **Testing**: Mocha, Chai, Supertest
- **Documentación**: Swagger/OpenAPI
- **Mocking**: Faker.js para datos ficticios
- **Contenización**: Docker
- **Variables de Entorno**: dotenv

## 🚀 Instalación y Uso

### Requisitos
- Node.js 18+
- MongoDB Atlas o local
- Docker (opcional)

## 📊 Estado del Proyecto

- ✅ **API REST** completa y funcional
- ✅ **Base de datos** MongoDB Atlas integrada
- ✅ **Tests automatizados** (11/11 tests passing)
- ✅ **Documentación** Swagger para Users y Pets
- ✅ **Docker** imagen disponible en DockerHub
- ✅ **Mocking** de datos para desarrollo y testing
- ✅ **Autenticación** con sessions y cookies

