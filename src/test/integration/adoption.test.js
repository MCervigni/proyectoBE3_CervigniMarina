import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { setupTestDatabase, cleanDatabase, closeDatabase, createTestUser, createTestPet } from '../helpers/testSetup.js';

// Importar routers necesarios
import adoptionsRouter from '../../routes/adoption.router.js';
import usersRouter from '../../routes/users.router.js';
import petsRouter from '../../routes/pets.router.js';

// Configurar app de testing
const app = express();
app.use(express.json());
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

describe('🏠 ADOPTION ROUTER - Tests Funcionales', function() {
  this.timeout(10000);

  let testUser;
  let testPet;
  let createdAdoption;

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

  // Preparar datos antes de cada test
  beforeEach(async () => {
    await cleanDatabase();
    
    // Crear usuario de prueba
    const userResponse = await request(app)
      .post('/api/users')
      .send(createTestUser());
    testUser = userResponse.body.payload;

    // Crear mascota de prueba
    const petResponse = await request(app)
      .post('/api/pets')
      .send(createTestPet());
    testPet = petResponse.body.payload;
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

    it('✅ Debería retornar todas las adopciones cuando existen registros', async () => {
      // Crear una adopción primero
      await request(app)
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
        .expect(200);

      const response = await request(app)
        .get('/api/adoptions')
        .expect(200);

      expect(response.body).to.have.property('status', 'success');
      expect(response.body.payload).to.be.an('array');
      expect(response.body.payload).to.have.lengthOf(1);
      
      const adoption = response.body.payload[0];
      expect(adoption).to.have.property('_id');
      expect(adoption).to.have.property('owner');
      expect(adoption).to.have.property('pet');
    });
  });

  describe('🔍 GET /api/adoptions/:aid - Obtener adopción por ID', () => {
    beforeEach(async () => {
      // Crear adopción de prueba
      const adoptionResponse = await request(app)
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
        .expect(200);
      createdAdoption = adoptionResponse.body.payload;
    });

    it('✅ Debería retornar adopción cuando el ID es válido y existe', async () => {
      const response = await request(app)
        .get(`/api/adoptions/${createdAdoption._id}`)
        .expect(200);

      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('payload');
      
      const adoption = response.body.payload;
      expect(adoption).to.have.property('_id', createdAdoption._id);
      expect(adoption).to.have.property('owner');
      expect(adoption).to.have.property('pet');
    });

    it('❌ Debería retornar error 404 cuando el ID no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/adoptions/${fakeId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });

    it('❌ Debería retornar error 400 cuando el ID es inválido', async () => {
      const invalidId = 'id-invalido-123';
      
      const response = await request(app)
        .get(`/api/adoptions/${invalidId}`)
        .expect(400);

      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });
  });

  describe('➕ POST /api/adoptions/:uid/:pid - Crear nueva adopción', () => {
    it('✅ Debería crear adopción exitosamente con datos válidos', async () => {
      const response = await request(app)
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
        .expect(200);

      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('payload');
      
      const adoption = response.body.payload;
      expect(adoption).to.have.property('_id');
      expect(adoption).to.have.property('owner', testUser._id);
      expect(adoption).to.have.property('pet', testPet._id);
    });

    it('❌ Debería retornar error 404 cuando el usuario no existe', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post(`/api/adoptions/${fakeUserId}/${testPet._id}`)
        .expect(404);

      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });

    it('❌ Debería retornar error 404 cuando la mascota no existe', async () => {
      const fakePetId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post(`/api/adoptions/${testUser._id}/${fakePetId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });

    it('❌ Debería retornar error 400 cuando el ID de usuario es inválido', async () => {
      const invalidUserId = 'usuario-invalido';
      
      const response = await request(app)
        .post(`/api/adoptions/${invalidUserId}/${testPet._id}`)
        .expect(400);

      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });

    it('❌ Debería retornar error 400 cuando el ID de mascota es inválido', async () => {
      const invalidPetId = 'mascota-invalida';
      
      const response = await request(app)
        .post(`/api/adoptions/${testUser._id}/${invalidPetId}`)
        .expect(400);

      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });

    it('❌ Debería retornar error 400 cuando la mascota ya está adoptada', async () => {
      // Primera adopción exitosa
      await request(app)
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
        .expect(200);

      // Segunda adopción de la misma mascota debería fallar
      const response = await request(app)
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
        .expect(400);

      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error');
    });

    it('✅ Debería permitir que el mismo usuario adopte múltiples mascotas', async () => {
      // Crear segunda mascota
      const secondPetResponse = await request(app)
        .post('/api/pets')
        .send({
          name: 'Luna',
          specie: 'cat',
          birthDate: '2021-03-10'
        });
      const secondPet = secondPetResponse.body.payload;

      // Primera adopción
      const firstAdoption = await request(app)
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
        .expect(200);

      // Segunda adopción
      const secondAdoption = await request(app)
        .post(`/api/adoptions/${testUser._id}/${secondPet._id}`)
        .expect(200);

      expect(firstAdoption.body.status).to.equal('success');
      expect(secondAdoption.body.status).to.equal('success');
      expect(firstAdoption.body.payload.owner).to.equal(testUser._id);
      expect(secondAdoption.body.payload.owner).to.equal(testUser._id);
    });
  });

  describe('🔄 Tests de Integridad de Datos', () => {
    it('✅ Debería actualizar el estado de la mascota a adoptada', async () => {
      await request(app)
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
        .expect(200);

      // Verificar que la mascota esté marcada como adoptada
      const petResponse = await request(app)
        .get(`/api/pets/${testPet._id}`)
        .expect(200);

      expect(petResponse.body.payload).to.have.property('adopted', true);
      expect(petResponse.body.payload).to.have.property('owner', testUser._id);
    });

    it('✅ Debería agregar la mascota a la lista del usuario', async () => {
      await request(app)
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
        .expect(200);

      // Verificar que el usuario tenga la mascota en su lista
      const userResponse = await request(app)
        .get(`/api/users/${testUser._id}`)
        .expect(200);

      expect(userResponse.body.payload.pets).to.be.an('array');
      expect(userResponse.body.payload.pets).to.include(testPet._id);
    });

    it('✅ Debería mantener consistencia después de múltiples adopciones', async () => {
      // Crear múltiples usuarios y mascotas
      const adoptions = [];
      
      for (let i = 0; i < 3; i++) {
        const userResp = await request(app)
          .post('/api/users')
          .send({
            first_name: `Usuario${i}`,
            last_name: 'Test',
            email: `user${i}@test.com`,
            password: 'password123'
          });

        const petResp = await request(app)
          .post('/api/pets')
          .send({
            name: `Mascota${i}`,
            specie: 'dog',
            birthDate: '2020-01-01'
          });

        const adoptionResp = await request(app)
          .post(`/api/adoptions/${userResp.body.payload._id}/${petResp.body.payload._id}`)
          .expect(200);

        adoptions.push(adoptionResp.body.payload);
      }

      // Verificar que todas las adopciones se registraron
      const allAdoptionsResponse = await request(app)
        .get('/api/adoptions')
        .expect(200);

      expect(allAdoptionsResponse.body.payload).to.have.lengthOf(3);
    });
  });
});