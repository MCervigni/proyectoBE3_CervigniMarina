import { generatePets, generateUsers } from '../utils/mocking.js';

export default class MockingRepository {
    constructor(usersService, petsService) {
        this.usersService = usersService;
        this.petsService = petsService;
    }

    generateMockPets = async (count) => {
        return generatePets(count);
    };

    generateMockUsers = async (count) => {
        return await generateUsers(count);
    };

    insertMockData = async ({ users, pets }) => {
        const result = {
            usersInserted: 0,
            petsInserted: 0
        };

        // Generar e insertar usuarios si se especifica
        if (users && users > 0) {
            const generatedUsers = await generateUsers(parseInt(users));
            
            for (const user of generatedUsers) {
                try {
                    await this.usersService.create(user);
                    result.usersInserted++;
                } catch (error) {
                    console.error('Error insertando usuario:', error);
                }
            }
        }

        // Generar e insertar mascotas si se especifica
        if (pets && pets > 0) {
            const generatedPets = generatePets(parseInt(pets));
            
            for (const pet of generatedPets) {
                try {
                    await this.petsService.create(pet);
                    result.petsInserted++;
                } catch (error) {
                    console.error('Error insertando mascota:', error);
                }
            }
        }

        return result;
    };
}
