import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AdoptMe API',
      version: '1.0.0',
      description: 'API para sistema de adopción de mascotas con funcionalidad de mocking',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor alternativo',
      },
    ],
  },
  apis: ['./src/docs/*.yaml'], // archivos YAML con la documentación
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };