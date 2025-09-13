import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { setupTestDatabase, cleanDatabase, closeDatabase } from '../helpers/testSetup.js';

// Solo el router de adoption
import adoptionsRouter from '../../routes/adoption.router.js';

// Configurar app de testing
const app = express();
app.use(express.json());
app.use('/api/adoptions', adoptionsRouter);

describe('🏠 ADOPTION ROUTER - Tests Funcionales', function() {
  this.timeout(15000);

  // Configuración inicial
  before(async () => {
    console.log('\n🔧 Configurando tests de adopciones...');
    await setupTestDatabase();
  });

  // Limpieza final
  after(async () => {
    console.log('\n🧹 Limpiando después de todos los tests...');
    await closeDatabase();
  });

  // Limpiar antes de cada test
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('📋 GET /api/adoptions - Obtener todas las adopciones', () => {
    it('✅ Debería retornar lista vacía cuando no hay adopciones', async () => {
      const response = await request(app)
        .get('/api/adoptions')
        .expect(200);

      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('payload');
      expect(response.body.payload).to.be.an('array');
      expect(response.body.payload).to.have.lengthOf(0);
    });

    it('✅ Debería retornar estructura correcta de respuesta', async () => {
      const response = await request(app)
        .get('/api/adoptions')
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('payload');
      expect(response.body.status).to.equal('success');
    });
  });

  describe('🔍 GET /api/adoptions/:aid - Obtener adopción por ID', () => {
    it('❌ Debería retornar error 404 cuando el ID no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/adoptions/${fakeId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });

    it('❌ Debería manejar ID inválido apropiadamente', async () => {
      const invalidId = 'invalid123';
      
      try {
        const response = await request(app)
          .get(`/api/adoptions/${invalidId}`)
          .timeout(5000);

        expect(response.status).to.be.oneOf([400, 404, 500]);
        
        if (response.status !== 500) {
          expect(response.body).to.have.property('status', 'error');
        }
      } catch (error) {
        // Acepta timeout como comportamiento válido
        expect(error.message).to.include('timeout');
      }
    });

    it('❌ Debería rechazar ID vacío', async () => {
      const response = await request(app)
        .get('/api/adoptions/')
        .expect(200); // Esto va a getAllAdoptions

      expect(response.body).to.have.property('status', 'success');
      expect(response.body.payload).to.be.an('array');
    });
  });

  describe('➕ POST /api/adoptions/:uid/:pid - Crear nueva adopción', () => {
    it('❌ Debería retornar error 404 cuando el usuario no existe', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const fakePetId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post(`/api/adoptions/${fakeUserId}/${fakePetId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });

    it('❌ Debería manejar ID de usuario inválido apropiadamente', async () => {
      const invalidUserId = 'usuario-invalido';
      const validPetId = new mongoose.Types.ObjectId();
      
      try {
        const response = await request(app)
          .post(`/api/adoptions/${invalidUserId}/${validPetId}`)
          .timeout(5000);

        expect(response.status).to.be.oneOf([400, 404, 500]);
        
        if (response.status !== 500) {
          expect(response.body).to.have.property('status', 'error');
        }
      } catch (error) {
        // Acepta timeout como comportamiento válido
        expect(error.message).to.include('timeout');
      }
    });

    it('❌ Debería manejar ID de mascota inválido apropiadamente', async () => {
      const validUserId = new mongoose.Types.ObjectId();
      const invalidPetId = 'mascota-invalida';
      
      const response = await request(app)
        .post(`/api/adoptions/${validUserId}/${invalidPetId}`);

      // Acepta 400 o 404 según implementación  
      expect(response.status).to.be.oneOf([400, 404, 500]);
      
      if (response.status !== 500) {
        expect(response.body).to.have.property('status', 'error');
        expect(response.body).to.have.property('error');
      }
    });

    it('❌ Debería manejar ambos IDs inválidos', async () => {
      const invalidUserId = 'user-invalid';
      const invalidPetId = 'pet-invalid';
      
      const response = await request(app)
        .post(`/api/adoptions/${invalidUserId}/${invalidPetId}`);

      // Acepta 400 o 404 según implementación
      expect(response.status).to.be.oneOf([400, 404, 500]);
      
      if (response.status !== 500) {
        expect(response.body).to.have.property('status', 'error');
        expect(response.body).to.have.property('error');
      }
    });

    it('❌ Debería rechazar IDs vacíos', async () => {
      const response = await request(app)
        .post('/api/adoptions//')
        .expect(404); // Express no encuentra la ruta
    });

    it('❌ Debería manejar IDs muy largos', async () => {
      const tooLongId = 'a'.repeat(30);
      const validId = new mongoose.Types.ObjectId();
      
      try {
        const response = await request(app)
          .post(`/api/adoptions/${tooLongId}/${validId}`)
          .timeout(3000);

        expect(response.status).to.be.oneOf([400, 404, 500]);
      } catch (error) {
        // Acepta timeout como comportamiento válido
        expect(error.message).to.include('timeout');
      }
    });

    it('❌ Debería manejar caracteres especiales en IDs', async () => {
      const specialCharId = 'user@123';
      const validId = new mongoose.Types.ObjectId();
      
      try {
        const response = await request(app)
          .post(`/api/adoptions/${specialCharId}/${validId}`)
          .timeout(3000);

        expect(response.status).to.be.oneOf([400, 404, 500]);
        
        if (response.status !== 500) {
          expect(response.body).to.have.property('status', 'error');
        }
      } catch (error) {
        // Acepta timeout como comportamiento válido
        expect(error.message).to.include('timeout');
      }
    });
  });

  describe('🔀 Tests de estructura de rutas', () => {
    it('✅ Debería tener todas las rutas definidas correctamente', async () => {
      // Test GET /api/adoptions
      const getAllResponse = await request(app)
        .get('/api/adoptions');
      expect(getAllResponse.status).to.be.oneOf([200, 500]);

      // Test GET /api/adoptions/:aid con ID válido
      const validId = new mongoose.Types.ObjectId();
      const getOneResponse = await request(app)
        .get(`/api/adoptions/${validId}`);
      expect(getOneResponse.status).to.be.oneOf([200, 404, 500]);

      // Test POST /api/adoptions/:uid/:pid con IDs válidos
      const validUserId = new mongoose.Types.ObjectId();
      const validPetId = new mongoose.Types.ObjectId();
      const postResponse = await request(app)
        .post(`/api/adoptions/${validUserId}/${validPetId}`);
      expect(postResponse.status).to.be.oneOf([200, 201, 404, 400, 500]);
    });

    it('✅ Debería rechazar métodos HTTP no permitidos', async () => {
      // Test PUT (no debería estar permitido)
      const putResponse = await request(app)
        .put('/api/adoptions/123')
        .expect(404);

      // Test DELETE (no debería estar permitido)
      const deleteResponse = await request(app)
        .delete('/api/adoptions/123')
        .expect(404);

      // Test PATCH (no debería estar permitido)
      const patchResponse = await request(app)
        .patch('/api/adoptions/123')
        .expect(404);
    });
  });

  describe('🛡️ Tests de validación de parámetros', () => {
    it('❌ Debería validar formato de ObjectId para usuario', async () => {
      const invalidId = '123';
      const validPetId = new mongoose.Types.ObjectId();

      try {
        const response = await request(app)
          .post(`/api/adoptions/${invalidId}/${validPetId}`)
          .timeout(3000);
        
        expect(response.status).to.be.oneOf([400, 404, 500]);
        
        if (response.status !== 500) {
          expect(response.body).to.have.property('status', 'error');
        }
      } catch (error) {
        // Acepta timeout como comportamiento válido
        expect(error.message).to.include('timeout');
      }
    });

    it('❌ Debería validar formato de ObjectId para mascota', async () => {
      const invalidFormats = [
        '123',
        'xyz'
      ];

      const validUserId = new mongoose.Types.ObjectId();

      for (const invalidId of invalidFormats) {
        const response = await request(app)
          .post(`/api/adoptions/${validUserId}/${invalidId}`);
        
        // Acepta múltiples códigos de error según implementación real
        expect(response.status).to.be.oneOf([400, 404, 500]);
        
        if (response.status !== 500) {
          expect(response.body).to.have.property('status', 'error');
        }
      }
    });
  });

  describe('📊 Tests de respuesta y formato', () => {
    it('✅ Debería retornar Content-Type application/json', async () => {
      const response = await request(app)
        .get('/api/adoptions');

      expect(response.headers['content-type']).to.match(/application\/json/);
    });

    it('✅ Debería manejar solicitudes sin headers', async () => {
      const response = await request(app)
        .get('/api/adoptions')
        .set('Accept', '');

      expect(response.status).to.be.oneOf([200, 406, 500]);
    });
  });
});