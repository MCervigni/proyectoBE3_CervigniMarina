import { Router } from "express";
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

// Endpoint para generar mascotas ficticias (migrado del primer desafío)
// Acepta query param ?count=cantidad (por defecto 100)
router.get('/mockingpets', mocksController.getMockingPets);

// Endpoint para generar usuarios ficticios
// Acepta query param ?count=cantidad (por defecto 50)
router.get('/mockingusers', mocksController.getMockingUsers);

// Endpoint POST para generar e insertar datos en la base de datos
router.post('/generateData', mocksController.generateData);

export default router;
