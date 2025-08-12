export default class MockingRepository {
    constructor(dao, usersService, petsService) {
        this.dao = dao;
        this.usersService = usersService;
        this.petsService = petsService;
    }

    generateMockPets = async (count) => {
        return this.dao.generateMultiplePets(count);
    };

    generateMockUsers = async (count) => {
        return await this.dao.generateMultipleUsers(count);
    };

    insertMockData = async ({ users, pets }) => {
        const result = {
            usersInserted: 0,
            petsInserted: 0
        };

        // Generar e insertar usuarios si se especifica
        if (users && users > 0) {
            const generatedUsers = await this.dao.generateMultipleUsers(parseInt(users));
            
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
            const generatedPets = this.dao.generateMultiplePets(parseInt(pets));
            
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
