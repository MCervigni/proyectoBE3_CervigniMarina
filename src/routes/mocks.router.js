import { Router } from "express";
import { generatePets, generateUsers } from '../utils/mocking.js';
import { usersService, petsService } from '../services/index.js';

const router = Router();

router.get('/mockingpets', async (req, res) => {
    try {
        const { count = 50 } = req.query;
        const pets = generatePets(parseInt(count));
        res.status(200).json({
            status: 'success',
            payload: pets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

router.get('/mockingusers', async (req, res) => {
    try {
        const { count = 50 } = req.query;
        const users = await generateUsers(parseInt(count));
        res.status(200).json({
            status: 'success',
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

router.post('/generateData', async (req, res) => {
    try {
        // Obtener parámetros del body Y query params
        // Prioridad: body > query params
        const bodyUsers = req.body.users;
        const bodyPets = req.body.pets;
        const queryUsers = req.query.users;
        const queryPets = req.query.pets;
        
        // Usar body si existe, sino query params
        const users = bodyUsers !== undefined ? bodyUsers : queryUsers;
        const pets = bodyPets !== undefined ? bodyPets : queryPets;
        
        // Validar que se proporcione al menos un parámetro
        if (!users && !pets) {
            return res.status(400).json({
                status: 'error',
                error: 'Debe proporcionar al menos un parámetro: users o pets (por body o query params)',
                examples: {
                    body: '{"users": 5, "pets": 10}',
                    queryParams: '?users=5&pets=10'
                }
            });
        }

        // Validar que users sea un número positivo
        if (users !== undefined) {
            const usersNum = Number(users);
            if (isNaN(usersNum) || usersNum <= 0 || !Number.isInteger(usersNum)) {
                return res.status(400).json({
                    status: 'error',
                    error: 'El parámetro "users" debe ser un número entero positivo',
                    received: { users: users, type: typeof users }
                });
            }
        }

        // Validar que pets sea un número positivo
        if (pets !== undefined) {
            const petsNum = Number(pets);
            if (isNaN(petsNum) || petsNum <= 0 || !Number.isInteger(petsNum)) {
                return res.status(400).json({
                    status: 'error',
                    error: 'El parámetro "pets" debe ser un número entero positivo',
                    received: { pets: pets, type: typeof pets }
                });
            }
        }

        const result = { usersInserted: 0, petsInserted: 0 };

        // Insertar usuarios
        if (users && users > 0) {
            const generatedUsers = await generateUsers(parseInt(users));
            for (const user of generatedUsers) {
                await usersService.create(user);
                result.usersInserted++;
            }
        }

        // Insertar mascotas
        if (pets && pets > 0) {
            const generatedPets = generatePets(parseInt(pets));
            for (const pet of generatedPets) {
                await petsService.create(pet);
                result.petsInserted++;
            }
        }

        res.status(201).json({
            status: 'success',
            message: `Se insertaron ${result.usersInserted} usuarios y ${result.petsInserted} mascotas`,
            payload: result
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

export default router;
