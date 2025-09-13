import mongoose from 'mongoose';
import { config } from '../../config/config.js';

// Configuración para testing
export const setupTestDatabase = async () => {
  try {
    // Usar una base de datos específica para tests
    const testDbName = `${config.DB_NAME}_test`;
    const testMongoUrl = config.MONGO_URL.replace(config.DB_NAME, testDbName);
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testMongoUrl);
      console.log('Conectado a base de datos de test');
    }
  } catch (error) {
    console.error('Error conectando a la base de datos de test:', error);
    throw error;
  }
};

export const cleanDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log('Base de datos limpiada');
  } catch (error) {
    console.error('Error limpiando la base de datos:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
      console.log('Conexión a base de datos cerrada');
    }
  } catch (error) {
    console.error('Error cerrando la base de datos:', error);
    throw error;
  }
};

// Helper para crear datos de prueba
export const createTestUser = () => ({
  first_name: 'Juan',
  last_name: 'Adoptador',
  email: `juan.adoptador.${Date.now()}@test.com`,
  password: 'password123'
});

export const createTestPet = () => ({
  name: 'Max',
  specie: 'dog',
  birthDate: '2020-01-15'
});