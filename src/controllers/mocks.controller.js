import { mockingService } from "../services/index.js";

const getMockingPets = async (req, res) => {
    try {
        const { count = 100 } = req.query;
        const pets = await mockingService.generateMockPets(parseInt(count));
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
};

const getMockingUsers = async (req, res) => {
    try {
        const { count = 50 } = req.query;
        const users = await mockingService.generateMockUsers(parseInt(count));
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
};

const generateData = async (req, res) => {
    try {
        const { users, pets } = req.body;
        
        // Validar que se proporcionen parámetros válidos
        if (!users && !pets) {
            return res.status(400).json({
                status: 'error',
                error: 'Debe proporcionar al menos un parámetro: users o pets'
            });
        }

        const result = await mockingService.insertMockData({ users, pets });

        res.status(201).json({
            status: 'success',
            message: `Se insertaron ${result.usersInserted} usuarios y ${result.petsInserted} mascotas en la base de datos`,
            payload: result
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
};

export default {
    getMockingPets,
    getMockingUsers,
    generateData
};
